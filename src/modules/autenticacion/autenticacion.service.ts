import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(usuario: string, contrasena: string): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuario(usuario);

    if (respuesta) {
      const pass = createHash('sha256').update(contrasena).digest('hex');
      if (respuesta.contrasena !== pass) {
        throw new HttpException(
          'El usuario no existe.',
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (respuesta.estado === 'INACTIVO') {
        throw new HttpException(
          'El usuario se encuentra deshabilitado.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return {
        id: respuesta.id,
        usuario: respuesta.usuario,
      };
    }
    return null;
  }

  async autenticar(usuario: any) {
    const payload = { usuario: usuario.usuario, sub: usuario.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
