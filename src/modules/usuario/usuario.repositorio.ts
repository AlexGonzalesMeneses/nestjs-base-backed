import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@EntityRepository(Usuario)
export class UsuarioRepositorio extends Repository<Usuario> {
  recuperar() {
    return getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .getMany();
  }

  buscarUsuario(usuario: string) {
    // return Usuario.findOne({ usuario });
    return getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('rol.rolModulo', 'rolModulo')
      .leftJoinAndSelect('rolModulo.modulo', 'modulo')
      .where({ usuario: usuario })
      .getOne();
  }
}
