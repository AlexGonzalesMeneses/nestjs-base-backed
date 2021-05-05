import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { TextService } from '../../common/lib/text.service';
import { Rol } from '../../core/authorization/entity/rol.entity';
import { UsuarioRol } from '../../core/authorization/entity/usuario-rol.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Persona } from '../persona/persona.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { Usuario } from './usuario.entity';
import { PersonaDto } from '../persona/persona.dto';

@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, orden } = paginacionQueryDto;
    this.createQueryBuilder().useTransaction;
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
      .innerJoin('usuario.persona', 'persona')
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
    usuario.contrasena = await TextService.encrypt(TextService.generateUuid());
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
      .select(['usuario.id', 'usuario.estado'])
      .where('usuario.codigoDesbloqueo = :codigo', { codigo })
      .getOne();
  }

  async runTransaction(op) {
    return this.manager.transaction(op);
  }
}
