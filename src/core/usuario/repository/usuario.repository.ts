import { TextService } from '../../../common/lib/text.service';
import { Rol } from '../../authorization/entity/rol.entity';
import { UsuarioRol } from '../../authorization/entity/usuario-rol.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Persona } from '../entity/persona.entity';
import { CrearUsuarioDto } from '../dto/crear-usuario.dto';
import { Usuario } from '../entity/usuario.entity';
import { PersonaDto } from '../dto/persona.dto';
import { Status } from '../../../common/constants';
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto';

@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> {
  async listar(paginacionQueryDto: FiltrosUsuarioDto) {
    const { limite, saltar, filtro, rol } = paginacionQueryDto;
    console.log('rol', rol);
    const queryBuilder = await this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.correoElectronico',
        'usuario.estado',
        'usuario.ciudadaniaDigital',
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
      .where('usuarioRol.estado = :estado', { estado: Status.ACTIVE })
      .andWhere(rol ? 'rol.id IN(:...roles)' : '1=1', {
        roles: rol,
      })
      .andWhere(
        filtro
          ? 'persona.nroDocumento like :filtro or persona.nombres ilike :filtro or persona.primerApellido ilike :filtro or persona.segundoApellido ilike :filtro'
          : '1=1',
        {
          filtro: `%${filtro}%`,
        },
      )
      .offset(saltar)
      .limit(limite)
      .getManyAndCount();
    return queryBuilder;
  }

  recuperar() {
    return this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .getMany();
  }

  buscarUsuario(usuario: string) {
    // return Usuario.findOne({ usuario });
    return this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where({ usuario: usuario })
      .getOne();
  }

  buscarUsuarioRolPorId(id: string) {
    return this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
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
      ])
      .where({ id })
      .getOne();
  }

  buscarUsuarioPorCI(persona: PersonaDto) {
    return this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('persona.nroDocumento = :ci', { ci: persona.nroDocumento })
      .getOne();
  }

  buscarUsuarioPorCorreo(correo: string) {
    return this.createQueryBuilder('usuario')
      .where('usuario.correoElectronico = :correo', { correo })
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
      usuarioRol.usuarioActualizacion = usuarioAuditoria;

      return usuarioRol;
    });

    // Persona
    const persona = new Persona();
    persona.nombres = usuarioDto?.persona?.nombres ?? null;
    persona.primerApellido = usuarioDto?.persona?.primerApellido ?? null;
    persona.segundoApellido = usuarioDto?.persona?.segundoApellido ?? null;
    persona.nroDocumento =
      usuarioDto?.persona?.nroDocumento ?? usuarioDto.usuario;
    persona.fechaNacimiento = usuarioDto?.persona?.fechaNacimiento ?? null;

    // Usuario
    const usuario = new Usuario();
    usuario.persona = persona;
    usuario.usuarioRol = usuarioRoles;

    usuario.usuario = usuarioDto?.persona?.nroDocumento ?? usuarioDto.usuario;
    usuario.estado = usuarioDto?.estado ?? Status.CREATE;
    usuario.correoElectronico = usuarioDto?.correoElectronico;
    usuario.contrasena =
      usuarioDto?.contrasena ??
      (await TextService.encrypt(TextService.generateUuid()));
    usuario.ciudadaniaDigital = usuarioDto?.ciudadaniaDigital ?? false;
    usuario.usuarioCreacion = usuarioAuditoria;

    return this.save(usuario);
  }

  async actualizarContadorBloqueos(idUsuario, intento) {
    const usuario = new Usuario();
    usuario.id = idUsuario;
    usuario.intentos = intento;

    return this.save(usuario);
  }

  async actualizarDatosBloqueo(idUsuario, codigo, fechaBloqueo) {
    const usuario = new Usuario();
    usuario.id = idUsuario;
    usuario.codigoDesbloqueo = codigo;
    usuario.fechaBloqueo = fechaBloqueo;

    return this.save(usuario);
  }

  buscarPorCodigoDesbloqueo(codigo: string) {
    return this.createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoDesbloqueo = :codigo', { codigo })
      .getOne();
  }

  actualizarDatosPersona(persona: PersonaDto) {
    return this.createQueryBuilder()
      .update(Persona)
      .set(persona)
      .where('nroDocumento = :nroDocumento', {
        nroDocumento: persona.nroDocumento,
      })
      .execute();
  }

  async runTransaction(op) {
    return this.manager.transaction(op);
  }
}
