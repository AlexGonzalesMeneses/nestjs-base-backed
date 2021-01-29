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
import { successResponse } from '../../common/lib/http.module';
import {
  SUCCESS_CREATE,
  SUCCESS_DELETE,
  SUCCESS_LIST,
  SUCCESS_UPDATE,
} from '../../common/constants';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('entidades')
export class EntidadController {
  constructor(
    private entidadServicio: EntidadService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  async recuperar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    console.log('lkadsf process.env.NODE_ENV ', process.env.NODE_ENV);
    return successResponse(
      await this.entidadServicio.recuperar(paginacionQueryDto),
      SUCCESS_LIST,
    );
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
    return successResponse(
      await this.entidadServicio.guardar(entidadDto),
      SUCCESS_CREATE,
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() entidadDto: EntidadDto) {
    // return this.entidadServicio.update(id, entidadDto);
    return successResponse(
      await this.entidadServicio.update(id, entidadDto),
      SUCCESS_UPDATE,
    );
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    // return this.entidadServicio.remove(id);
    return successResponse(
      await this.entidadServicio.remove(id),
      SUCCESS_DELETE,
    );
  }
}
