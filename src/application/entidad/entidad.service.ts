import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntidadRepository } from './entidad.repository';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TotalRowsResponseDto } from '../../common/dto/total-rows-response.dto';
import { totalRowsResponse } from '../../common/lib/http.module';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';

@Injectable()
export class EntidadService {
  constructor(
    @InjectRepository(EntidadRepository)
    private entidadRepositorio: EntidadRepository,
  ) {}

  async listar(
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ): Promise<TotalRowsResponseDto> {
    const resultado = await this.entidadRepositorio.listar(paginacionQueryDto);
    return totalRowsResponse(resultado);
  }
}
