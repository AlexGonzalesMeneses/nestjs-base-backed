import { Injectable } from '@nestjs/common';
import { UsuarioRepositorio } from './usuario.repositorio';
import { Usuario } from 'src/modules/usuario/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
}
