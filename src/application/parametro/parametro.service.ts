import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParametroRepository } from './parametro.repository';
import { Parametro } from './parametro.entity';
import { CrearParametroDto } from './dto/crear-parametro.dto';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';

@Injectable()
export class ParametroService {
  constructor(
    @InjectRepository(ParametroRepository)
    private parametroRepositorio: ParametroRepository,
  ) {}

  async crear(parametroDto: CrearParametroDto): Promise<Parametro> {
    return await this.parametroRepositorio.crear(parametroDto);
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.parametroRepositorio.listar(paginacionQueryDto);
  }

  async listarPorGrupo(grupo: string) {
    return await this.parametroRepositorio.listarPorGrupo(grupo);
  }
}
