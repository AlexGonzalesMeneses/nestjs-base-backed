import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { STATUS_INACTIVE } from '../../common/constants';
import { TextService } from '../../common/lib/text.service';
import { Persona } from '../persona/persona.entity';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
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

    return {
      access_token: this.jwtService.sign(payload),
      ...usuario,
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

    return this.jwtService.sign(payload);
  }
}
