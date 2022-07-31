import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { ModuloService } from '../service/modulo.service';
import { CrearModuloDto, FiltroModuloDto } from '../dto/crear-modulo.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { CasbinGuard } from '../guards/casbin.guard';
import { ParamUuidDto } from '../../../common/dto/params-uuid.dto';

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('autorizacion/modulos')
export class ModuloController extends AbstractController {
  constructor(private moduloService: ModuloService) {
    super();
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async listar(@Query() paginacionQueryDto: FiltroModuloDto) {
    const result = await this.moduloService.listar(paginacionQueryDto);
    return this.successListRows(result);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async crear(@Body() moduloDto: any, @Req() req) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.moduloService.crear(moduloDto, usuarioAuditoria);
    return this.successCreate(result);
  }

  @Patch()
  @UsePipes(ValidationPipe)
  async upModulo(@Body() moduloDto: CrearModuloDto) {
    const result = await this.moduloService.actualizar(moduloDto);
    return this.successUpdate(result);
  }

  @Delete()
  @UsePipes(ValidationPipe)
  async deleteModulo(@Body() moduloDto: CrearModuloDto) {
    const result = await this.moduloService.eliminar(moduloDto);
    return this.successDelete(result);
  }

  // activar modulo
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/activacion')
  @UsePipes(ValidationPipe)
  async activar(@Req() req, @Param() params: ParamUuidDto) {
    const { id: idUsuario } = params;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.moduloService.activar(
      idUsuario,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // inactivar modulo
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() param: ParamUuidDto) {
    const { id: idUsuario } = param;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.moduloService.inactivar(
      idUsuario,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }
}
