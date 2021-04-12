import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Persona } from '../persona/persona.entity';
import { UsuarioDto } from './dto/usuario.dto';
import { Usuario } from './usuario.entity';

@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, orden } = paginacionQueryDto;
    const queryBuilder = await this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.estado',
        'usuarioRol',
        'rol.rol',
        'persona.nroDocumento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
      ])
      .orderBy('usuario.fechaCreacion', orden)
      .offset(saltar)
      .limit(limite)
      .getManyAndCount();
    return queryBuilder;
  }

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

  async crear(usuarioDto: UsuarioDto, usuarioAuditoria: string) {
    usuarioDto.usuarioCreacion = usuarioAuditoria;
    await this.save(usuarioDto);
    return usuarioDto;
  }
}
