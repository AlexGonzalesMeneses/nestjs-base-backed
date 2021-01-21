import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParametroService } from './parametro.service';
import { ParametroDto } from './dto/parametro.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Parametro } from './parametro.entity';

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
