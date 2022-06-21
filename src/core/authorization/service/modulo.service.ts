import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuloRepository } from '../repository/modulo.repository';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { CrearModuloDto } from '../dto/crear-modulo.dto';

@Injectable()
export class ModuloService {
  constructor(
    @InjectRepository(ModuloRepository)
    private moduloRepositorio: ModuloRepository,
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.moduloRepositorio.listar(paginacionQueryDto);
  }

  async listarTodo() {
    return await this.moduloRepositorio.obtenerModulosSubmodulos();
  }

  async crear(moduloDto: CrearModuloDto) {
    return await this.moduloRepositorio.crear(moduloDto);
  }
}
