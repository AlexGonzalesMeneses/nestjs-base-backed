import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { EntidadService } from 'src/modules/entidad/entidad.service';
import { Entidad } from 'src/modules/entidad/entidad.entity';
import { EntidadDto } from 'src/modules/entidad/dto/entidad.dto';

@Controller('entidad')
export class EntidadController {
  constructor(private entidadServicio: EntidadService) {}

  @Get()
  recuperarEntidades(): Promise<Entidad[]> {
    return this.entidadServicio.recuperarEntidades();
  }

  @Post()
  @UsePipes(ValidationPipe)
  guardarEntidad(@Body() entidadDto: EntidadDto): Promise<Entidad> {
    return this.entidadServicio.guardarEntidad(entidadDto);
  }
}
