import { UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import {
  Client,
  Issuer,
  Strategy,
  TokenSet,
  UserinfoResponse,
} from 'openid-client'
import { PersonaDto } from '../../usuario/dto/persona.dto'
import { AuthenticationService } from '../service/authentication.service'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const buildOpenIdClient = async () => {
  try {
    const issuer = await Issuer.discover(process.env.OIDC_ISSUER || '')
    return new issuer.Client({
      client_id: process.env.OIDC_CLIENT_ID || '',
      client_secret: process.env.OIDC_CLIENT_SECRET,
    })
  } catch (error) {
    console.error('Error al conectar a ciudadanía:', error.message)
  }
}

export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  client: Client

  constructor(
    private readonly autenticacionService: AuthenticationService,
    client: Client
  ) {
    super({
      client: client,
      params: {
        redirect_uri: process.env.OIDC_REDIRECT_URI,
        scope: process.env.OIDC_SCOPE,
      },
      passReqToCallback: false,
      usePKCE: false,
    })

    this.client = client
  }

  async validate(tokenset: TokenSet): Promise<PassportUser> {
    try {
      const userinfo: UserinfoResponse = await this.client.userinfo(tokenset)

      const ci = <documentoIdentidad>userinfo.documento_identidad

      /*if (/[a-z]/i.test(ci.numero_documento)) {
        ci.complemento = ci.numero_documento.slice(-2);
        ci.numero_documento = ci.numero_documento.slice(0, -2);
      }*/

      const fechaNacimiento = dayjs(
        (<string>userinfo.fecha_nacimiento).toString(),
        'DD/MM/YYYY',
        true
      ).format('YYYY-MM-DD')

      const persona = new PersonaDto()
      persona.tipoDocumento = ci.tipo_documento
      persona.nroDocumento = ci.numero_documento
      persona.fechaNacimiento = fechaNacimiento
      const nombre = <nombre>userinfo.nombre
      persona.nombres = nombre.nombres
      persona.primerApellido = nombre.primer_apellido
      persona.segundoApellido = nombre.segundo_apellido
      // const correoElectronico = userinfo.email;

      const datosUsuario = {
        correoElectronico: userinfo.email,
      }

      // Solo validar usuario
      /*const usuario = await this.autenticacionService.validarUsuarioOidc(
        persona,
      );*/

      // Para validar y crear usuario
      const usuario = await this.autenticacionService.validarOCrearUsuarioOidc(
        persona,
        datosUsuario
      )

      return {
        id: usuario.id,
        roles: usuario.roles || [],
        idToken: tokenset.id_token,
        accessToken: tokenset.access_token,
        refreshToken: tokenset.refresh_token,
        exp: tokenset.expires_at,
      }
    } catch (err) {
      throw new UnauthorizedException()
    }
  }
}

export interface documentoIdentidad {
  tipo_documento: string
  numero_documento: string
  complemento: string
}

export interface nombre {
  nombres: string
  primer_apellido: string
  segundo_apellido: string
}
