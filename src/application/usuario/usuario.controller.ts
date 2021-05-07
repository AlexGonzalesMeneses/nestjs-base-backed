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
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AbstractController } from '../../common/dto/abstract-controller.dto';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UsuarioService } from './usuario.service';
import { Messages } from '../../common/constants/response-messages';
import { ConfigService } from '@nestjs/config';
import { ParamUuidDto } from '../../common/dto/params-uuid.dto';
import { ActualizarContrasenaDto } from './dto/actualizar-contrasena.dto';
import { ActualizarUsuarioRolDto } from './dto/actualizar-usuario-rol.dto';
import { CrearUsuarioCiudadaniaDto } from './dto/crear-usuario-ciudadania.dto';

@Controller('usuarios')
export class UsuarioController extends AbstractController {
  constructor(
    private usuarioService: UsuarioService,
    private readonly configService: ConfigService,
  ) {
    super();
  }
  // GET users
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.usuarioService.listar(paginacionQueryDto);
    return this.successList(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async obtenerPerfil(@Request() req) {
    const idUsuario = this.getUser(req);
    const result = await this.usuarioService.buscarUsuarioId(idUsuario);
    return this.successList(result);
  }

  //create user
  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('/ciudadania')
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
  @UseGuards(JwtAuthGuard)
  @Patch('/activacion/:id')
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
  @UseGuards(JwtAuthGuard)
  @Patch('/inactivacion/:id')
  async inactivar(@Req() req, @Param() param: ParamUuidDto) {
    const { id: idUsuario } = param;
    const usuarioAuditoria = this.getUser(req);
    const result = await this.usuarioService.inactivar(
      idUsuario,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Patch('/contrasena')
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

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Patch('/contrasena/:id')
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
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async actualizarDatos(
    @Param() param: ParamUuidDto,
    @Body() usuarioDto: ActualizarUsuarioRolDto,
  ) {
    const { id: idUsuario } = param;
    const result = await this.usuarioService.actualizarDatos(
      idUsuario,
      usuarioDto,
    );
    return this.successUpdate(result);
  }

  @Get('desbloqueo')
  @UsePipes(ValidationPipe)
  async desbloquearCuenta(@Query() query: ParamUuidDto, @Res() res) {
    const { id: idDesbloqueo } = query;
    await this.usuarioService.desbloquearCuenta(idDesbloqueo);
    return res
      .status(200)
      .redirect(`${this.configService.get('URL_FRONTEND')}/#/login`);
  }
}
