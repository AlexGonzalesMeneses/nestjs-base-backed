import { Inject, Injectable } from '@nestjs/common';
import { ModuloRepository } from '../repository/modulo.repository';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { CrearModuloDto } from '../dto/crear-modulo.dto';
import { Status } from '../../../common/constants';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../../common/constants/response-messages';
import { Modulo } from '../entity/modulo.entity';

@Injectable()
export class ModuloService {
  constructor(
    @Inject(ModuloRepository)
    private moduloRepositorio: ModuloRepository,
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.moduloRepositorio.listar(paginacionQueryDto);
  }

  async listarTodo() {
    return await this.moduloRepositorio.obtenerModulosSubmodulos();
  }

  async crear(moduloDto: CrearModuloDto, usuarioAuditoria: string) {
    return await this.moduloRepositorio.crear(moduloDto, usuarioAuditoria);
  }
  async actualizar(moduloDto: CrearModuloDto) {
    return await this.moduloRepositorio.actualizar({
      ...moduloDto,
      ...{ fidModulo: { id: moduloDto.id } as Modulo },
    });
  }
  async eliminar(moduloDto: CrearModuloDto) {
    return await this.moduloRepositorio.eliminar(moduloDto);
  }

  async activar(idModulo, usuarioAuditoria: string) {
    const modulo = await this.moduloRepositorio.buscarPorId(idModulo);
    if (modulo) {
      const moduloActualizado = await this.moduloRepositorio.actualizar({
        id: idModulo,
        estado: Status.ACTIVE,
        usuarioActualizacion: usuarioAuditoria,
      });
      return {
        id: moduloActualizado.id,
        estado: moduloActualizado.estado,
      };
    } else {
      throw new EntityNotFoundException(Messages.EXCEPTION_DEFAULT);
    }
  }

  async inactivar(idModulo, usuarioAuditoria: string) {
    const modulo = await this.moduloRepositorio.buscarPorId(idModulo);
    if (modulo) {
      const moduloActualizado = await this.moduloRepositorio.actualizar({
        id: idModulo,
        estado: Status.INACTIVE,
        usuarioActualizacion: usuarioAuditoria,
      });
      return {
        id: moduloActualizado.id,
        estado: moduloActualizado.estado,
      };
    } else {
      throw new EntityNotFoundException(Messages.EXCEPTION_DEFAULT);
    }
  }
}
