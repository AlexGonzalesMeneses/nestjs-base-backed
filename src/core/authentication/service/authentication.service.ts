import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../../../application/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { TextService } from '../../../common/lib/text.service';
import { RefreshTokensService } from './refreshTokens.service';
import { Status, Configurations } from '../../../common/constants';
import { EntityUnauthorizedException } from '../../../common/exceptions/entity-unauthorized.exception';
import { Messages } from '../../../common/constants/response-messages';
import * as dayjs from 'dayjs';
import { MensajeriaService } from '../../../core/external-services/mensajeria/mensajeria.service';
import { PersonaDto } from 'src/application/persona/persona.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly mensajeriaService: MensajeriaService,
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
        this.mensajeriaService.sendEmail(
          usuario.correoElectronico,
          Messages.SUBJECT_EMAIL_ACCOUNT_LOCKED,
          `El link de desbloqueo es su cuenta es: ${codigo}`,
        );
        return true;
      } else if (
        usuario.fechaBloqueo &&
        dayjs().isAfter(usuario.fechaBloqueo)
      ) {
        return false;
      }
      return true;
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
      const statusValid = [Status.ACTIVE, Status.PENDING];
      if (!statusValid.includes(respuesta.estado as Status)) {
        throw new EntityUnauthorizedException(Messages.INVALID_USER);
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
      if (respuesta.estado === Status.INACTIVE) {
        throw new EntityUnauthorizedException(Messages.INACTIVE_USER);
      }
      const roles = [];
      if (respuesta.usuarioRol.length) {
        respuesta.usuarioRol.map((usuarioRol) => {
          roles.push(usuarioRol.rol.rol);
        });
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
