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
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard';
import { Roles } from '../../core/authorization/rol.decorator';
import { Rol } from '../../core/authorization/rol.enum';
import { CasbinGuard } from '../../core/authorization/guards/casbin.guard';

@Controller('parametros')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ParametroController {
  constructor(private parametroServicio: ParametroService) {}

  @Get()
  @Roles(Rol.Admin)
  recuperar(): Promise<Parametro[]> {
    return this.parametroServicio.recuperar();
  }

  @Post()
  @UsePipes(ValidationPipe)
  guardar(@Body() parametroDto: ParametroDto): Promise<Parametro> {
    return this.parametroServicio.guardar(parametroDto);
  }
}
