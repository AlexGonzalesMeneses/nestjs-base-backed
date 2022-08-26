import { TextService } from '../../../common/lib/text.service'
import { Rol } from '../../authorization/entity/rol.entity'
import { UsuarioRol } from '../../authorization/entity/usuario-rol.entity'
import { Persona } from '../entity/persona.entity'
import { CrearUsuarioDto } from '../dto/crear-usuario.dto'
import { Usuario } from '../entity/usuario.entity'
import { PersonaDto } from '../dto/persona.dto'
import { Status } from '../../../common/constants'
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto'
import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class UsuarioRepository {
  constructor(private dataSource: DataSource) {}

  async listar(paginacionQueryDto: FiltrosUsuarioDto) {
    const { limite, saltar, filtro, rol } = paginacionQueryDto
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
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
          ? '(persona.nroDocumento like :filtro or persona.nombres ilike :filtro or persona.primerApellido ilike :filtro or persona.segundoApellido ilike :filtro)'
          : '1=1',
        {
          filtro: `%${filtro}%`,
        }
      )
      .take(limite)
      .skip(saltar)
      .orderBy('usuario.id', 'ASC')
      .getManyAndCount()
  }

  async recuperar() {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .getMany()
  }

  async buscarUsuario(usuario: string) {
    // return Usuario.findOne({ usuario });
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where({ usuario: usuario })
      .getOne()
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .where({ id: id })
      .getOne()
  }

  async buscarUsuarioRolPorId(id: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.contrasena',
        'usuario.estado',
        'usuario.ciudadaniaDigital',
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
      .getOne()
  }

  async buscarUsuarioPorCI(persona: PersonaDto) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('persona.nroDocumento = :ci', { ci: persona.nroDocumento })
      .getOne()
  }

  async verificarExisteUsuarioPorCI(ci: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoin('usuario.persona', 'persona')
      .select('usuario.id')
      .where('persona.nroDocumento = :ci', { ci: ci })
      .getOne()
  }

  async buscarUsuarioPorCorreo(correo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .where('usuario.correoElectronico = :correo', { correo })
      .getOne()
  }

  async crear(usuarioDto: CrearUsuarioDto, usuarioAuditoria: string) {
    const usuarioRoles: UsuarioRol[] = usuarioDto.roles.map((idRol) => {
      // Rol
      const rol = new Rol()
      rol.id = idRol

      // UsuarioRol
      const usuarioRol = new UsuarioRol()
      usuarioRol.rol = rol
      usuarioRol.usuarioCreacion = usuarioAuditoria

      return usuarioRol
    })

    // Usuario

    return await this.dataSource.getRepository(Usuario).save({
      persona: {
        nombres: usuarioDto?.persona?.nombres,
        primerApellido: usuarioDto?.persona?.primerApellido,
        segundoApellido: usuarioDto?.persona?.segundoApellido,
        nroDocumento: usuarioDto?.persona?.nroDocumento,
        fechaNacimiento: usuarioDto?.persona?.fechaNacimiento,
        tipoDocumento: usuarioDto.persona.tipoDocumento,
      },
      usuarioRol: usuarioRoles,
      usuario: usuarioDto.usuario,
      estado: usuarioDto?.estado ?? Status.CREATE,
      correoElectronico: usuarioDto?.correoElectronico,
      contrasena:
        usuarioDto?.contrasena ??
        (await TextService.encrypt(TextService.generateUuid())),
      ciudadaniaDigital: usuarioDto?.ciudadaniaDigital ?? false,
      usuarioCreacion: usuarioAuditoria,
    })
  }

  async crearConCiudadania(usuarioDto, usuarioAuditoria: string) {
    const usuarioRoles: UsuarioRol[] = usuarioDto.roles.map((rol) => {
      const usuarioRol = new UsuarioRol()
      usuarioRol.rol = rol
      usuarioRol.usuarioCreacion = usuarioAuditoria

      return usuarioRol
    })

    // Persona
    const persona = new Persona()
    persona.nombres = usuarioDto?.persona?.nombres ?? null
    persona.primerApellido = usuarioDto?.persona?.primerApellido ?? null
    persona.segundoApellido = usuarioDto?.persona?.segundoApellido ?? null
    persona.nroDocumento =
      usuarioDto?.persona?.nroDocumento ?? usuarioDto.usuario
    persona.fechaNacimiento = usuarioDto?.persona?.fechaNacimiento ?? null
    persona.usuarioCreacion = usuarioAuditoria

    persona.tipoDocumento = usuarioDto.persona.tipoDocumento ?? null
    persona.telefono = usuarioDto?.persona?.telefono ?? null

    // Usuario
    const usuario = new Usuario()
    usuario.persona = persona
    usuario.usuarioRol = usuarioRoles

    usuario.usuario = usuarioDto?.persona?.nroDocumento ?? usuarioDto.usuario
    usuario.estado = usuarioDto?.estado ?? Status.CREATE
    usuario.correoElectronico = usuarioDto?.correoElectronico
    usuario.contrasena =
      usuarioDto?.contrasena ??
      (await TextService.encrypt(TextService.generateUuid()))
    usuario.ciudadaniaDigital = usuarioDto?.ciudadaniaDigital ?? false
    usuario.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Usuario).save(usuario)
  }

  async crearConPersonaExistente(usuarioDto, usuarioAuditoria: string) {
    const usuarioRoles: UsuarioRol[] = usuarioDto.roles.map((rol) => {
      const usuarioRol = new UsuarioRol()
      usuarioRol.rol = rol
      usuarioRol.usuarioCreacion = usuarioAuditoria

      return usuarioRol
    })

    // Usuario
    const usuario = new Usuario()
    usuario.usuarioRol = usuarioRoles

    // Persona
    usuario.persona = usuarioDto.persona

    usuario.usuario = usuarioDto?.persona?.nroDocumento ?? usuarioDto.usuario
    usuario.estado = usuarioDto?.estado ?? Status.CREATE
    usuario.correoElectronico = usuarioDto?.correoElectronico
    usuario.contrasena =
      usuarioDto?.contrasena ??
      (await TextService.encrypt(TextService.generateUuid()))
    usuario.ciudadaniaDigital = usuarioDto?.ciudadaniaDigital ?? false
    usuario.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Usuario).save(usuario)
  }

  async actualizarContadorBloqueos(idUsuario, intento) {
    const usuario = new Usuario()
    usuario.id = idUsuario
    usuario.intentos = intento

    return await this.dataSource.getRepository(Usuario).save(usuario)
  }

  async actualizarDatosBloqueo(idUsuario, codigo, fechaBloqueo) {
    const usuario = new Usuario()
    usuario.id = idUsuario
    usuario.codigoDesbloqueo = codigo
    usuario.fechaBloqueo = fechaBloqueo

    return await this.dataSource.getRepository(Usuario).save(usuario)
  }

  async actualizarDatosRecuperacion(idUsuario, codigo) {
    const usuario = new Usuario()
    usuario.id = idUsuario
    usuario.codigoRecuperacion = codigo

    return await this.dataSource.getRepository(Usuario).save(usuario)
  }

  async actualizarDatosActivacion(idUsuario, codigo) {
    const usuario = new Usuario()
    usuario.id = idUsuario
    usuario.codigoActivacion = codigo

    return await this.dataSource.getRepository(Usuario).save(usuario)
  }

  async actualizarDatosTransaccion(idUsuario, codigo) {
    const usuario = new Usuario()
    usuario.id = idUsuario
    usuario.codigoTransaccion = codigo

    return await this.dataSource.getRepository(Usuario).save(usuario)
  }

  async buscarPorCodigoDesbloqueo(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoDesbloqueo = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoRecuperacion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoRecuperacion = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoTransaccion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoTransaccion = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoActivacion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoActivacion = :codigo', { codigo })
      .getOne()
  }

  async actualizarDatosPersona(persona: PersonaDto) {
    return await this.dataSource
      .createQueryBuilder()
      .update(Persona)
      .set(persona)
      .where('nroDocumento = :nroDocumento', {
        nroDocumento: persona.nroDocumento,
      })
      .execute()
  }

  async actualizarUsuario(
    id: string,
    usuario: Partial<Usuario>
  ): Promise<Usuario> {
    return await this.dataSource.getRepository(Usuario).save({
      id: id,
      ...usuario,
    })
  }

  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.getRepository(Usuario).manager.transaction(op)
  }
}
