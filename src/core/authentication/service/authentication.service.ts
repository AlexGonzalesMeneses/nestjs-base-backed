import { Inject, Injectable } from '@nestjs/common';
import { UsuarioService } from '../../usuario/service/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { TextService } from '../../../common/lib/text.service';
import { RefreshTokensService } from './refreshTokens.service';
import { Status } from '../../../common/constants';
import { Configurations } from '../../../common/params';
import { EntityUnauthorizedException } from '../../../common/exceptions/entity-unauthorized.exception';
import { Messages } from '../../../common/constants/response-messages';
import * as dayjs from 'dayjs';
import { MensajeriaService } from '../../../core/external-services/mensajeria/mensajeria.service';
import { PersonaDto } from '../../usuario/dto/persona.dto';
import { ConfigService } from '@nestjs/config';
import { TemplateEmailService } from '../../../common/templates/templates-email.service';

@Injectable()
export class AuthenticationService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly mensajeriaService: MensajeriaService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  private async verificarBloqueo(usuario) {
    if (usuario.intentos >= Configurations.WRONG_LOGIN_LIMIT) {
      if (!usuario.fechaBloqueo) {
        // generar codigo y fecha de desbloqueo
        const codigo = TextService.generateUuid();
        const fechaBloqueo = dayjs().add(
          Configurations.MINUTES_LOGIN_LOCK,
          'minute',
        );
        await this.usuarioService.actualizarDatosBloqueo(
          usuario.id,
          codigo,
          fechaBloqueo,
        );
        // enviar codigo por email
        const urlDesbloqueo = `${this.configService.get(
          'URL_FRONTEND',
        )}/#/desbloqueo?q=${codigo}`;
        const template = TemplateEmailService.armarPlantillaBloqueoCuenta(
          urlDesbloqueo,
        );
        this.mensajeriaService.sendEmail(
          usuario.correoElectronico,
          Messages.SUBJECT_EMAIL_ACCOUNT_LOCKED,
          template,
        );
        return true;
      } else if (
        usuario.fechaBloqueo &&
        dayjs().isAfter(usuario.fechaBloqueo)
      ) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  private async generarIntentoBloqueo(usuario) {
    if (dayjs().isAfter(usuario.fechaBloqueo)) {
      // restaurar datos bloqueo
      await this.usuarioService.actualizarDatosBloqueo(usuario.id, null, null);
      await this.usuarioService.actualizarContadorBloqueos(usuario.id, 1);
    } else {
      const intento = usuario.intentos + 1;
      await this.usuarioService.actualizarContadorBloqueos(usuario.id, intento);
    }
  }

  async validarUsuario(usuario: string, contrasena: string): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuario(usuario);
    if (respuesta) {
      // verificar si la cuenta contiene un estado valido
      const statusValid = [Status.ACTIVE, Status.PENDING];
      if (!statusValid.includes(respuesta.estado as Status)) {
        throw new EntityUnauthorizedException(Messages.INVALID_USER);
      }
      // verificar si la cuenta esta bloqueada
      const verificacionBloqueo = await this.verificarBloqueo(respuesta);
      if (verificacionBloqueo) {
        throw new EntityUnauthorizedException(Messages.USER_BLOCKED);
      }

      const pass = TextService.decodeBase64(contrasena);
      if (!(await TextService.compare(pass, respuesta.contrasena))) {
        await this.generarIntentoBloqueo(respuesta);
        throw new EntityUnauthorizedException(
          Messages.INVALID_USER_CREDENTIALS,
        );
      }
      // si se logra autenticar con exito => reiniciar contador de intentos a 0
      if (respuesta.intentos > 0) {
        this.usuarioService.actualizarContadorBloqueos(respuesta.id, 0);
      }
      let roles = [];
      if (respuesta.usuarioRol.length) {
        roles = respuesta.usuarioRol
          .map((usuarioRol) =>
            usuarioRol.estado === Status.ACTIVE ? usuarioRol.rol.rol : null,
          )
          .filter(Boolean);
      }

      return { id: respuesta.id, roles };
    }
    return null;
  }

  async autenticar(user: any) {
    const usuario = await this.usuarioService.buscarUsuarioId(user.id);

    const payload = { id: user.id, roles: user.roles };
    // crear refresh_token
    const refreshToken = await this.refreshTokensService.create(user.id);
    // construir respuesta
    const data = {
      access_token: this.jwtService.sign(payload),
      ...usuario,
    };
    return {
      refresh_token: { id: refreshToken.id },
      data,
    };
  }

  async validarUsuarioOidc(persona: PersonaDto): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuarioPorCI(persona);
    if (respuesta) {
      const { estado, persona: datosPersona } = respuesta;
      if (estado === Status.INACTIVE) {
        throw new EntityUnauthorizedException(Messages.INACTIVE_USER);
      }
      // actualizar datos persona
      if (
        datosPersona.nombres !== persona.nombres &&
        datosPersona.primerApellido !== persona.primerApellido &&
        datosPersona.segundoApellido !== persona.segundoApellido &&
        datosPersona.fechaNacimiento !== persona.fechaNacimiento
      ) {
        await this.usuarioService.actualizarDatosPersona(persona);
      }
      let roles = [];
      if (respuesta.usuarioRol.length) {
        roles = respuesta.usuarioRol.map((usuarioRol) => usuarioRol.rol.rol);
      }
      return { id: respuesta.id, roles };
    }
    return null;
  }

  async autenticarOidc(user: any) {
    const payload = { id: user.id, roles: user.roles };
    // crear refresh_token
    const refreshToken = await this.refreshTokensService.create(user.id);
    // construir respuesta
    const data = {
      access_token: this.jwtService.sign(payload),
    };
    return {
      refresh_token: { id: refreshToken.id },
      data,
    };
  }
}
