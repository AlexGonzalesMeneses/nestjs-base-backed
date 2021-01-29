import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AutenticacionService } from '../autenticacion.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly autenticacionService: AutenticacionService) {
    super({
      usernameField: 'usuario',
      passwordField: 'contrasena',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const usuario = await this.autenticacionService.validarUsuario(
      username,
      password,
    );
    if (!usuario) {
      throw new UnauthorizedException();
    }
    const datos = { id: usuario.id };
    return datos;
  }
}
