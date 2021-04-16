import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
  Param,
  Query,
  Inject,
} from '@nestjs/common';
import { EntidadService } from './entidad.service';
import { EntidadDto } from './dto/entidad.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entidad } from './entidad.entity';

import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AbstractController } from '../../common/dto/abstract-controller.dto';

@Controller('entidades')
export class EntidadController extends AbstractController {
  constructor(
    private entidadServicio: EntidadService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super();
  }

  @Get()
  async recuperar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.entidadServicio.recuperar(paginacionQueryDto);
    return this.successList(result);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async guardar(@Body() entidadDto: EntidadDto) {
    if (process.env.NODE_ENV === 'development') {
      this.logger.info(
        'Esto es un INFO deberia salir en console entorno dev....',
      );
    } else {
      this.logger.error(
        'Esto es un ERROR deberia salir en archivo en entorno prod....',
      );
    }
    const result = this.entidadServicio.guardar(entidadDto);
    return this.successCreate(result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() entidadDto: EntidadDto) {
    const result = await this.entidadServicio.update(id, entidadDto);
    return this.successUpdate(result);
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.entidadServicio.remove(id);
    return this.successDelete(result);
  }
}
