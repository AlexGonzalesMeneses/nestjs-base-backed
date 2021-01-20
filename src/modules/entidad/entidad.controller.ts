import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EntidadService } from 'src/modules/entidad/entidad.service';
import { EntidadDto } from 'src/modules/entidad/dto/entidad.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entidad } from './entidad.entity';

@Controller('entidades')
export class EntidadController {
  constructor(private entidadServicio: EntidadService) {}

  @Get()
  recuperar(): Promise<Entidad[]> {
    return this.entidadServicio.recuperar();
  }

  @Post()
  @UsePipes(ValidationPipe)
  guardar(@Body() entidadDto: EntidadDto): Promise<Entidad> {
    return this.entidadServicio.guardar(entidadDto);
  }
}
