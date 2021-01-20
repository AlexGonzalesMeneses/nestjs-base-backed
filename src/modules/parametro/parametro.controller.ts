import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ParametroService } from 'src/modules/parametro/parametro.service';
import { Parametro } from 'src/modules/parametro/parametro.entity';
import { ParametroDto } from 'src/modules/parametro/dto/parametro.dto';

@Controller('parametros')
export class ParametroController {
  constructor(private parametroServicio: ParametroService) {}

  @Get()
  recuperar(): Promise<Parametro[]> {
    return this.parametroServicio.recuperar();
  }

  @Post()
  @UsePipes(ValidationPipe)
  guardar(@Body() parametroDto: ParametroDto): Promise<Parametro> {
    return this.parametroServicio.guardar(parametroDto);
  }
}
