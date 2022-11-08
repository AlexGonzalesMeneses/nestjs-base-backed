import { BaseService } from '../../../common/base/base-service'
import { Inject, Injectable } from '@nestjs/common'
import { RolRepository } from '../repository/rol.repository'
import { CrearRolDto } from '../dto/crear-rol.dto'
import { EntityNotFoundException } from 'src/common/exceptions/entity-not-found.exception'
import { Messages } from 'src/common/constants/response-messages'
import { Status } from 'src/common/constants'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'

@Injectable()
export class RolService extends BaseService {
  constructor(
    @Inject(RolRepository)
    private rolRepositorio: RolRepository
  ) {
    super(RolService.name)
  }

  async listar() {
    return await this.rolRepositorio.listar()
  }

  async listarTable(paginacionQueryDto: PaginacionQueryDto) {
    return await this.rolRepositorio.listarTable(paginacionQueryDto)
  }

  async crear(rolDto: CrearRolDto, usuarioAuditoria: string) {
    return await this.rolRepositorio.crear(rolDto, usuarioAuditoria)
  }

  async actualizar(id: string, rolDto: CrearRolDto, usuarioAuditoria: string) {
    const rol = await this.rolRepositorio.buscarPorId(id)
    if (!rol) {
      throw new EntityNotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    await this.rolRepositorio.actualizar(id, rolDto, usuarioAuditoria)
    return { id }
  }

  async activar(idRol: string, usuarioAuditoria: string) {
    const rol = await this.rolRepositorio.buscarPorId(idRol)
    if (!rol) {
      throw new EntityNotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const rolDto = new CrearRolDto()
    rolDto.estado = Status.ACTIVE
    await this.rolRepositorio.actualizar(idRol, rolDto, usuarioAuditoria)
    return { id: idRol, estado: rolDto.estado }
  }

  async inactivar(idRol: string, usuarioAuditoria: string) {
    const rol = await this.rolRepositorio.buscarPorId(idRol)
    if (!rol) {
      throw new EntityNotFoundException(Messages.EXCEPTION_DEFAULT)
    }

    const rolDto = new CrearRolDto()
    rolDto.estado = Status.INACTIVE
    await this.rolRepositorio.actualizar(idRol, rolDto, usuarioAuditoria)
    return { id: idRol, estado: rolDto.estado }
  }
}
