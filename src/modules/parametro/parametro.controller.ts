import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ParametroService } from './parametro.service';
import { ParametroDto } from './dto/parametro.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Parametro } from './parametro.entity';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@Controller('parametros')
export class ParametroController {
  constructor(private parametroServicio: ParametroService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  recuperar(): Promise<Parametro[]> {
    return this.parametroServicio.recuperar();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  guardar(@Body() parametroDto: ParametroDto): Promise<Parametro> {
    return this.parametroServicio.guardar(parametroDto);
  }
}
