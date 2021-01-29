import { Injectable } from '@nestjs/common';
import { UsuarioRepositorio } from './usuario.repositorio';
import { Usuario } from 'src/modules/usuario/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Persona } from '../persona/persona.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioRepositorio)
    private usuarioRepositorio: UsuarioRepositorio,
  ) {}

  async buscarUsuario(usuario: string): Promise<Usuario> {
    return this.usuarioRepositorio.buscarUsuario(usuario);
  }
  async recuperar(): Promise<Usuario[]> {
    return this.usuarioRepositorio.recuperar();
  }

  async buscarUsuarioId(id: string): Promise<any> {
    const usuario = await this.usuarioRepositorio.buscarUsuarioId(id);

    const roles = [];
    if (usuario.usuarioRol.length) {
      usuario.usuarioRol.map((usuarioRol) => {
        const modulos = usuarioRol.rol.rolModulo.map((m) => m.modulo);
        roles.push({ rol: usuarioRol.rol.rol, modulos });
      });
    }
    return {
      id: usuario.id,
      usuario: usuario.usuario,
      roles,
    };
  }

  async buscarUsuarioPorCI(persona: Persona): Promise<Usuario> {
    return this.usuarioRepositorio.buscarUsuarioPorCI(persona);
  }
}
