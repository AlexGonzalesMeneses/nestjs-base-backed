import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { TextService } from '../../common/lib/text.service';
import { Rol } from '../../core/authorization/entity/rol.entity';
import { UsuarioRol } from '../../core/authorization/entity/usuario-rol.entity';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Persona } from '../persona/persona.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
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
        'usuario.correoElectronico',
        'usuario.estado',
        'usuarioRol',
        'rol.id',
        'rol.rol',
        'persona.nroDocumento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.fechaNacimiento',
        'persona.tipoDocumento',
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
        'usuario.contrasena',
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

  async crear(usuarioDto: CrearUsuarioDto, usuarioAuditoria: string) {
    const usuarioRoles: UsuarioRol[] = usuarioDto.roles.map((idRol) => {
      // Rol
      const rol = new Rol();
      rol.id = idRol;

      // UsuarioRol
      const usuarioRol = new UsuarioRol();
      usuarioRol.rol = rol;
      return usuarioRol;
    });

    // Persona
    const persona = new Persona();
    persona.nombres = usuarioDto.persona.nombres;
    persona.primerApellido = usuarioDto.persona.primerApellido;
    persona.segundoApellido = usuarioDto.persona.segundoApellido;
    persona.nroDocumento = usuarioDto.persona.nroDocumento;
    persona.fechaNacimiento = usuarioDto.persona.fechaNacimiento;

    // Usuario
    const usuario = new Usuario();
    usuario.persona = persona;
    usuario.usuarioRol = usuarioRoles;

    usuario.usuario = usuarioDto.persona.nroDocumento;
    usuario.correoElectronico = usuarioDto.correoElectronico;
    usuario.contrasena = TextService.encrypt(TextService.generateUuid());
    usuario.usuarioCreacion = usuarioAuditoria;

    return this.save(usuario);
  }
}
