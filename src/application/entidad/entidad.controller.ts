import { Controller, Get, Query } from '@nestjs/common';
import { EntidadService } from './entidad.service';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { AbstractController } from '../../common/dto/abstract-controller.dto';

@Controller('entidades')
export class EntidadController extends AbstractController {
  constructor(private entidadServicio: EntidadService) {
    super();
  }

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.entidadServicio.listar(paginacionQueryDto);
    return this.successList(result);
  }
}
