import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuloRepository } from '../repository/modulo.repository';
import { Modulo } from '../entity/modulo.entity';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
@Injectable()
export class ModuloService {
  constructor(
    @InjectRepository(ModuloRepository)
    private moduloRepositorio: ModuloRepository,
  ) {}

  async recuperar(paginacionQuery: PaginacionQueryDto): Promise<Modulo[]> {
    const { limit, offset } = paginacionQuery;
    return this.moduloRepositorio.find({
      skip: offset,
      take: limit,
    });
  }
}
