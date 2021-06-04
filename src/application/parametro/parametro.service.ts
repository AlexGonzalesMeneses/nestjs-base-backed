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
    const result = await this.parametroRepositorio.crear(parametroDto);
    return result;
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.parametroRepositorio.listar(paginacionQueryDto);
    return result;
  }

  async listarPorGrupo(grupo: string) {
    const result = await this.parametroRepositorio.listarPorGrupo(grupo);
    return result;
  }
}
