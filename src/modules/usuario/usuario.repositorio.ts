import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@EntityRepository(Usuario)
export class UsuarioRepositorio extends Repository<Usuario> {
  buscarUsuario(usuario: string) {
    // return Usuario.findOne({ usuario });
    return getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where({ usuario: usuario })
      .getOne();
  }
  recuperar() {
    return getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .getMany();
  }
}
