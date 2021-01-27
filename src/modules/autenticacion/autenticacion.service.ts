import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { STATUS_INACTIVE } from '../../common/constants';
import { encrypt } from '../../common/lib/text.module';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(usuario: string, contrasena: string): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuario(usuario);
    if (respuesta) {
      const pass = encrypt(contrasena);
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
          const modulos = usuarioRol.rol.rolModulo.map((m) => m.modulo);
          roles.push({ rol: usuarioRol.rol.rol, modulos });
        });
      }
      return {
        id: respuesta.id,
        usuario: respuesta.usuario,
        roles,
      };
    }
    return null;
  }

  async autenticar(usuario: any) {
    const payload = {
      usuario: usuario.usuario,
      sub: usuario.id,
      roles: usuario.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
      roles: usuario.roles,
      usuario: usuario.usuario,
    };
  }
}
