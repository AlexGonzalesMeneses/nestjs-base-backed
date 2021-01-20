import { EntityRepository, Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@EntityRepository(Usuario)
export class UsuarioRepositorio extends Repository<Usuario> {
  buscarUsuario(usuario: string) {
    return Usuario.findOne({ usuario });
  }
}
