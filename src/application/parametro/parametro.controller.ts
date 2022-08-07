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
  Patch,
} from '@nestjs/common'
import { ParametroService } from './parametro.service'
import { CrearParametroDto } from './dto/crear-parametro.dto'
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto'
import { AbstractController } from '../../common/dto/abstract-controller.dto'
import { ParamGrupoDto } from './dto/grupo.dto'
import { ParamUuidDto } from '../../common/dto/params-uuid.dto'
import { ActualizarParametroDto } from './dto/actualizar-parametro.dto'

@Controller('parametros')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ParametroController extends AbstractController {
  constructor(private parametroServicio: ParametroService) {
    super()
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
    })
  )
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.parametroServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @UsePipes(ValidationPipe)
  @Get('/:grupo/listado')
  async listarPorGrupo(@Param() params: ParamGrupoDto) {
    const { grupo } = params
    const result = await this.parametroServicio.listarPorGrupo(grupo)
    return this.successList(result)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async crear(@Body() parametroDto: CrearParametroDto) {
    const result = await this.parametroServicio.crear(parametroDto)
    return this.successCreate(result)
  }

  @Patch(':id')
  async actualizar(
    @Param() param: ParamUuidDto,
    @Body() parametroDto: ActualizarParametroDto
  ) {
    const { id: idParametro } = param
    const result = await this.parametroServicio.actualizarDatos(
      idParametro,
      parametroDto
    )
    return this.successUpdate(result)
  }

  @Patch('/:id/activacion')
  async activar(@Param() params: ParamUuidDto) {
    const { id: idParametro } = params
    const result = await this.parametroServicio.activar(idParametro)
    return this.successUpdate(result)
  }

  @Patch('/:id/inactivacion')
  async inactivar(@Param() params: ParamUuidDto) {
    const { id: idParametro } = params
    const result = await this.parametroServicio.inactivar(idParametro)
    return this.successUpdate(result)
  }
}
