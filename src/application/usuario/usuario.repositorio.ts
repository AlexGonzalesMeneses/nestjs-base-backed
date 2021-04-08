import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Persona } from '../persona/persona.entity';
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
      .where({ usuario: usuario })
      .getOne();
  }

  buscarUsuarioId(id: string) {
    return getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('rol.rolModulo', 'rolModulo')
      .leftJoinAndSelect('rolModulo.modulo', 'modulo')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.estado',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.tipoDocumento',
        'persona.nroDocumento',
        'persona.fechaNacimiento',
        'usuarioRol',
        'rol',
        'rolModulo',
        'modulo',
      ])
      .where({ id })
      .getOne();
  }

  buscarUsuarioPorCI(persona: Persona) {
    return getRepository(Usuario)
      .createQueryBuilder('usuario')
      .innerJoin('usuario.persona', 'persona')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('persona.tipoDocumento = :td', { td: persona.tipoDocumento })
      .andWhere('persona.nroDocumento = :ci', { ci: persona.nroDocumento })
      .getOne();
  }
}
