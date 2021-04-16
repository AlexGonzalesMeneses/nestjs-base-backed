import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuarioService } from '../../../application/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { TextService } from '../../../common/lib/text.service';
import { Persona } from '../../../application/persona/persona.entity';
import { RefreshTokensService } from './refreshTokens.service';
import { Status } from '../../../common/constants';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  async validarUsuario(usuario: string, contrasena: string): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuario(usuario);
    if (respuesta) {
      const pass = TextService.encrypt(contrasena);
      if (respuesta.contrasena !== pass) {
        throw new HttpException(
          'El usuario no existe.',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const statusValid = [Status.ACTIVE, Status.PENDING];
      if (!statusValid.includes(respuesta.estado as Status)) {
        throw new UnauthorizedException(
          `El usuario se encuentra en estado ${respuesta.estado}`,
        );
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

  async validarUsuarioOidc(persona: Persona): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuarioPorCI(persona);
    if (respuesta) {
      if (respuesta.estado === Status.INACTIVE) {
        throw new HttpException(
          'El usuario se encuentra deshabilitado.',
          HttpStatus.UNAUTHORIZED,
        );
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
