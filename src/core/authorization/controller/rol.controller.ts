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
} from '@nestjs/common'
import { RolService } from '../service/rol.service'
import { BaseController } from '../../../common/base/base-controller'
import { CasbinGuard } from '../guards/casbin.guard'
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard'
import { CrearRolDto } from '../dto/crear-rol.dto'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto'

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('autorizacion/roles')
export class RolController extends BaseController {
  constructor(private rolService: RolService) {
    super(RolController.name)
  }

  @Get()
  async listar() {
    const result = await this.rolService.listar()
    return this.successList(result)
  }

  @Get('table')
  async listarTable(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.rolService.listarTable(paginacionQueryDto)
    return this.successListRows(result)
  }

  @Post()
  async crear(@Req() req, @Body() rolDto: CrearRolDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.rolService.crear(rolDto, usuarioAuditoria)
    return this.successCreate(result)
  }

  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req,
    @Body() rolDto: CrearRolDto
  ) {
    const { id: idRol } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.rolService.actualizar(
      idRol,
      rolDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Patch('/:id/activacion')
  async activar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idRol } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.rolService.activar(idRol, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idRol } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.rolService.inactivar(idRol, usuarioAuditoria)
    return this.successUpdate(result)
  }
}
