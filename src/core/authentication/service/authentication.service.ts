import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsuarioService } from '../../../application/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { STATUS_INACTIVE } from '../../../common/constants';
import { TextService } from '../../../common/lib/text.service';
import { Persona } from '../../../application/persona/persona.entity';
import { RefreshTokensService } from './refreshTokens.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly configService: ConfigService,
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
      if (respuesta.estado === STATUS_INACTIVE) {
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

  async autenticar(user: any) {
    const usuario = await this.usuarioService.buscarUsuarioId(user.id);

    const payload = { id: user.id, roles: user.roles };
    // crear refresh_token
    const ttl = parseInt(
      this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      10,
    );
    const refreshToken = await this.refreshTokensService.create(user.id, ttl);
    // construir respuesta
    const data = {
      access_token: this.jwtService.sign(payload),
      ...usuario,
    };
    return {
      refresh_token: { id: refreshToken.id, exp_in: ttl },
      data,
    };
  }

  async validarUsuarioOidc(persona: Persona): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuarioPorCI(persona);
    if (respuesta) {
      if (respuesta.estado === STATUS_INACTIVE) {
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
    const ttl = parseInt(
      this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      10,
    );
    const refreshToken = await this.refreshTokensService.create(user.id, ttl);
    // construir respuesta
    const data = {
      access_token: this.jwtService.sign(payload),
    };
    return {
      refresh_token: { id: refreshToken.id, exp_in: ttl },
      data,
    };
  }
}
