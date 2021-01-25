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
import { Roles } from '../autorizacion/rol.decorator';
import { Rol } from '../autorizacion/rol.enum';
import { LocalAuthGuard } from '../autenticacion/guards/local-auth.guard';
import { RolesGuard } from '../autorizacion/rol.guard';

@Controller('parametros')
@UseGuards(LocalAuthGuard, RolesGuard)
export class ParametroController {
  constructor(private parametroServicio: ParametroService) {}

  @Get()
  @Roles(Rol.Admin)
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
