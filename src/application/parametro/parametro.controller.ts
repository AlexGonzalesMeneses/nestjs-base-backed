import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { ParametroService } from './parametro.service';
import { CrearParametroDto } from './dto/crear-parametro.dto';
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from '../../core/authorization/guards/casbin.guard';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { AbstractController } from '../../common/dto/abstract-controller.dto';
import { ParamGrupoDto } from './dto/grupo.dto';

@Controller('parametros')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ParametroController extends AbstractController {
  constructor(private parametroServicio: ParametroService) {
    super();
  }

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.parametroServicio.listar(paginacionQueryDto);
    return this.successListRows(result);
  }

  @UsePipes(ValidationPipe)
  @Get('/:grupo/listado')
  async listarPorGrupo(@Param() params: ParamGrupoDto) {
    const { grupo } = params;
    const result = await this.parametroServicio.listarPorGrupo(grupo);
    return this.successList(result);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async crear(@Body() parametroDto: CrearParametroDto) {
    const result = await this.parametroServicio.crear(parametroDto);
    return this.successCreate(result);
  }
}
