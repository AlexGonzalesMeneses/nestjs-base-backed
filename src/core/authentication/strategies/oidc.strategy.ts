import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Client, TokenSet, Issuer } from 'openid-client';
import * as dayjs from 'dayjs';
import { Persona } from 'src/application/persona/persona.entity';
import { AuthenticationService } from '../service/authentication.service';

export const buildOpenIdClient = async () => {
  const issuer = await Issuer.discover(process.env.OIDC_ISSUER);
  const client = new issuer.Client({
    client_id: process.env.OIDC_CLIENT_ID,
    client_secret: process.env.OIDC_CLIENT_SECRET,
  });
  return client;
};

export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  client: Client;

  constructor(
    private readonly autenticacionService: AuthenticationService,
    client: Client,
  ) {
    super({
      client: client,
      params: {
        redirect_uri: process.env.OIDC_REDIRECT_URI,
        scope: process.env.OIDC_SCOPE,
      },
      passReqToCallback: false,
      usePKCE: false,
    });

    this.client = client;
  }

  async validate(tokenset: TokenSet): Promise<any> {
    try {
      const userinfo = await this.client.userinfo(tokenset);

      const ci = <documentoIdentidad>userinfo.documento_identidad;
      if (/[a-z]/i.test(ci.numero_documento)) {
        ci.complemento = ci.numero_documento.slice(-2);
        ci.numero_documento = ci.numero_documento.slice(0, -2);
      }

      const fechaNacimiento = dayjs(
        userinfo.fecha_nacimiento.toString(),
        'DD/MM/YYYY',
      ).toDate();

      const persona = new Persona();
      persona.tipoDocumento = ci.tipo_documento;
      persona.nroDocumento = ci.numero_documento;
      persona.fechaNacimiento = fechaNacimiento;

      const usuario = await this.autenticacionService.validarUsuarioOidc(
        persona,
      );

      const data = {
        id: usuario.id,
        roles: usuario.roles || [],
        idToken: tokenset.id_token,
        accessToken: tokenset.access_token,
        refreshToken: tokenset.refresh_token,
        exp: tokenset.expires_at,
      };
      return data;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}

export interface documentoIdentidad {
  tipo_documento: string;
  numero_documento: string;
  complemento: string;
}
