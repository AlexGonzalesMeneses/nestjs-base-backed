import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { CrearUsuarioDto } from '../dto/crear-usuario.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UsuarioService } from '../service/usuario.service';
import { Messages } from '../../../common/constants/response-messages';
import { ParamUuidDto } from '../../../common/dto/params-uuid.dto';
import { ActualizarContrasenaDto } from '../dto/actualizar-contrasena.dto';
import { ActualizarUsuarioRolDto } from '../dto/actualizar-usuario-rol.dto';
import { CrearUsuarioCiudadaniaDto } from '../dto/crear-usuario-ciudadania.dto';
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto';
import { CasbinGuard } from '../../authorization/guards/casbin.guard';

@Controller('usuarios')
export class UsuarioController extends AbstractController {
  constructor(private usuarioService: UsuarioService) {
    super();
  }
  // GET users
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get()
  async listar(@Query() paginacionQueryDto: FiltrosUsuarioDto) {
    const result = await this.usuarioService.listar(paginacionQueryDto);
    return this.successListRows(result);
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('/cuenta/perfil')
  async obtenerPerfil(@Request() req) {
    const idUsuario = this.getUser(req);
    const result = await this.usuarioService.buscarUsuarioId(idUsuario);
    return this.successList(result);
  }

  //create user
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Req() req, @Body() usuarioDto: CrearUsuarioDto) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.usuarioService.crear(
      usuarioDto,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post('/cuenta/ciudadania')
  @UsePipes(new ValidationPipe({ transform: true }))
  async crearConCiudadania(
    @Req() req,
    @Body() usuarioDto: CrearUsuarioCiudadaniaDto,
  ) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.usuarioService.crearConCiudadania(
      usuarioDto,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  // activar usuario
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/activacion')
  @UsePipes(ValidationPipe)
  async activar(@Req() req, @Param() params: ParamUuidDto) {
    const { id: idUsuario } = params;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.usuarioService.activar(
      idUsuario,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // inactivar usuario
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() param: ParamUuidDto) {
    const { id: idUsuario } = param;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.usuarioService.inactivar(
      idUsuario,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(ValidationPipe)
  @Patch('/cuenta/contrasena')
  async actualizarContrasena(
    @Req() req,
    @Body() body: ActualizarContrasenaDto,
  ) {
    const idUsuario = this.getUser(req);
    const { contrasenaActual, contrasenaNueva } = body;
    const result = await this.usuarioService.actualizarContrasena(
      idUsuario,
      contrasenaActual,
      contrasenaNueva,
    );
    return this.successUpdate(result);
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(ValidationPipe)
  @Patch('/:id/restauracion')
  async restaurarContrasena(@Req() req, @Param() param: ParamUuidDto) {
    const usuarioAuditoria = this.getUser(req);
    const { id: idUsuario } = param;
    const result = await this.usuarioService.restaurarContrasena(
      idUsuario,
      usuarioAuditoria,
    );
    return this.successUpdate(result, Messages.SUCCESS_RESTART_PASSWORD);
  }

  //update user
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch(':id')
  async actualizarDatos(
    @Req() req,
    @Param() param: ParamUuidDto,
    @Body() usuarioDto: ActualizarUsuarioRolDto,
  ) {
    const { id: idUsuario } = param;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.usuarioService.actualizarDatos(
      idUsuario,
      usuarioDto,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @Get('cuenta/desbloqueo')
  @UsePipes(ValidationPipe)
  async desbloquearCuenta(@Query() query: ParamUuidDto) {
    const { id: idDesbloqueo } = query;
    const result = await this.usuarioService.desbloquearCuenta(idDesbloqueo);
    return this.successUpdate(result, Messages.SUCCESS_ACCOUNT_UNLOCK);
  }
}
