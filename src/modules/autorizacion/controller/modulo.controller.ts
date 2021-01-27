import { Controller, Get, Query } from '@nestjs/common';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { Modulo } from '../entity/modulo.entity';
import { ModuloService } from '../service/modulo.service';

@Controller('modulos')
export class ModuloController {
  constructor(private moduloService: ModuloService) {}

  @Get()
  recuperar(@Query() paginacionQuery: PaginacionQueryDto): Promise<Modulo[]> {
    // console.log(typeof Modulo);
    return this.moduloService.recuperar(paginacionQuery);
  }
}
