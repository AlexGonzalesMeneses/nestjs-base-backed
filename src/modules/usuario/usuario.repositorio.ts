import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Persona } from '../persona/persona.entity';
import { Usuario } from './usuario.entity';

@EntityRepository(Usuario)
export class UsuarioRepositorio extends Repository<Usuario> {
  buscarUsuario(usuario: string) {
    // return Usuario.findOne({ usuario });
    return getRepository(Usuario)
      .createQueryBuilder('usuario')
      .where({ usuario: usuario })
      .getOne();
  }

  buscarUsuarioId(id: string) {
    return getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('rol.rolModulo', 'rolModulo')
      .leftJoinAndSelect('rolModulo.modulo', 'modulo')
      .where({ id })
      .getOne();
  }

  recuperar() {
    return getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .getMany();
  }

  buscarUsuarioPorCI(persona: Persona) {
    return getRepository(Usuario)
      .createQueryBuilder('usuario')
      .innerJoin('usuario.persona', 'persona')
      .where('persona.tipoDocumento = :td', { td: persona.tipoDocumento })
      .andWhere('persona.nroDocumento = :ci', { ci: persona.nroDocumento })
      .getOne();
  }
}
