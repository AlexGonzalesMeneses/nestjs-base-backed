import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ParametroService } from './parametro.service'
import { CrearParametroDto } from './dto/crear-parametro.dto'
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto'
import { BaseController } from '../../common/base/base-controller'
import { ParamGrupoDto } from './dto/grupo.dto'
import { ActualizarParametroDto } from './dto/actualizar-parametro.dto'
import { LoggerService } from '../../core/logger/logger.service'
import { ParamNumberStringID } from '../../common/dto/paramNumberStringID'

@Controller('parametros')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ParametroController extends BaseController {
  constructor(
    protected logger: LoggerService,
    private parametroServicio: ParametroService
  ) {
    super(logger, ParametroController.name)
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
  async crear(@Req() req, @Body() parametroDto: CrearParametroDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.parametroServicio.crear(
      parametroDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @Patch(':id')
  async actualizar(
    @Param() params: ParamNumberStringID,
    @Req() req,
    @Body() parametroDto: ActualizarParametroDto
  ) {
    const { id: idParametro } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.parametroServicio.actualizarDatos(
      idParametro,
      parametroDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Patch('/:id/activacion')
  async activar(@Req() req, @Param() params: ParamNumberStringID) {
    const { id: idParametro } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.parametroServicio.activar(
      idParametro,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() params: ParamNumberStringID) {
    const { id: idParametro } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.parametroServicio.inactivar(
      idParametro,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
