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
} from '@nestjs/common'
import { BaseController } from '../../../common/base/base-controller'
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard'
import { CrearUsuarioDto } from '../dto/crear-usuario.dto'
import { UsuarioService } from '../service/usuario.service'
import { Messages } from '../../../common/constants/response-messages'
import { ParamUuidDto } from '../../../common/dto/params-uuid.dto'
import { ActualizarContrasenaDto } from '../dto/actualizar-contrasena.dto'
import { ActualizarUsuarioRolDto } from '../dto/actualizar-usuario-rol.dto'
import { CrearUsuarioCiudadaniaDto } from '../dto/crear-usuario-ciudadania.dto'
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto'
import { CasbinGuard } from '../../authorization/guards/casbin.guard'
import { CrearUsuarioCuentaDto } from '../dto/crear-usuario-cuenta.dto'
import {
  ActivarCuentaDto,
  NuevaContrasenaDto,
  RecuperarCuentaDto,
  ValidarRecuperarCuentaDto,
} from '../dto/recuperar-cuenta.dto'
import { LoggerService } from '../../logger/logger.service'
import { ParamIdDto } from '../../../common/dto/params-id.dto'

@Controller('usuarios')
export class UsuarioController extends BaseController {
  constructor(
    protected logger: LoggerService,
    private usuarioService: UsuarioService
  ) {
    super(logger, UsuarioController.name)
  }

  // GET users
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    })
  )
  @Get()
  async listar(@Query() paginacionQueryDto: FiltrosUsuarioDto) {
    const result = await this.usuarioService.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('/cuenta/perfil')
  async obtenerPerfil(@Request() req) {
    const idUsuario = this.getUser(req)
    const result = await this.usuarioService.buscarUsuarioId(idUsuario)
    return this.successList(result)
  }

  //create user
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Req() req, @Body() usuarioDto: CrearUsuarioDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.crear(usuarioDto, usuarioAuditoria)
    return this.successCreate(result)
  }

  //create user account
  @Post('crear-cuenta')
  @UsePipes(ValidationPipe)
  @UsePipes(new ValidationPipe({ transform: true }))
  async crearUsuario(@Req() req, @Body() usuarioDto: CrearUsuarioCuentaDto) {
    const result = await this.usuarioService.crearCuenta(usuarioDto)
    return this.successCreate(result, Messages.NEW_USER_ACCOUNT)
  }

  //restore user account
  @Post('recuperar')
  @UsePipes(ValidationPipe)
  @UsePipes(new ValidationPipe({ transform: true }))
  async recuperarCuenta(
    @Req() req,
    @Body() recuperarCuentaDto: RecuperarCuentaDto
  ) {
    const result = await this.usuarioService.recuperarCuenta(recuperarCuentaDto)
    return this.successList(result, Messages.SUBJECT_EMAIL_ACCOUNT_RECOVERY)
  }

  // validate restore user account
  @Post('validar-recuperar')
  @UsePipes(ValidationPipe)
  @UsePipes(new ValidationPipe({ transform: true }))
  async validarRecuperarCuenta(
    @Req() req,
    @Body() validarRecuperarCuentaDto: ValidarRecuperarCuentaDto
  ) {
    const result = await this.usuarioService.validarRecuperar(
      validarRecuperarCuentaDto
    )
    return this.success(result, Messages.SUCCESS_DEFAULT)
  }

  // activar usuario
  @Patch('/cuenta/activacion')
  @UsePipes(ValidationPipe)
  async activarCuenta(@Req() req, @Body() activarCuentaDto: ActivarCuentaDto) {
    const result = await this.usuarioService.activarCuenta(
      activarCuentaDto.codigo
    )
    return this.successUpdate(result, Messages.ACCOUNT_ACTIVED_SUCCESSFULLY)
  }

  // validate restore user account
  @Patch('/cuenta/nueva-contrasena')
  @UsePipes(ValidationPipe)
  @UsePipes(new ValidationPipe({ transform: true }))
  async nuevaContrasena(
    @Req() req,
    @Body() nuevaContrasenaDto: NuevaContrasenaDto
  ) {
    const result = await this.usuarioService.nuevaContrasenaTransaccion(
      nuevaContrasenaDto
    )
    return this.success(result, Messages.SUCCESS_DEFAULT)
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post('/cuenta/ciudadania')
  @UsePipes(new ValidationPipe({ transform: true }))
  async crearConCiudadania(
    @Req() req,
    @Body() usuarioDto: CrearUsuarioCiudadaniaDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.crearConCiudadania(
      usuarioDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  // activar usuario
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/activacion')
  @UsePipes(ValidationPipe)
  async activar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idUsuario } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.activar(
      idUsuario,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  // inactivar usuario
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req, @Param() params: ParamIdDto) {
    const { id: idUsuario } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.inactivar(
      idUsuario,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(ValidationPipe)
  @Patch('/cuenta/contrasena')
  async actualizarContrasena(
    @Req() req,
    @Body() body: ActualizarContrasenaDto
  ) {
    const idUsuario = this.getUser(req)
    const { contrasenaActual, contrasenaNueva } = body
    const result = await this.usuarioService.actualizarContrasena(
      idUsuario,
      contrasenaActual,
      contrasenaNueva
    )
    return this.successUpdate(result)
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @UsePipes(ValidationPipe)
  @Patch('/:id/restauracion')
  async restaurarContrasena(@Req() req, @Param() params: ParamIdDto) {
    const usuarioAuditoria = this.getUser(req)
    const { id: idUsuario } = params
    const result = await this.usuarioService.restaurarContrasena(
      idUsuario,
      usuarioAuditoria
    )
    return this.successUpdate(result, Messages.SUCCESS_RESTART_PASSWORD)
  }

  //update user
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch(':id')
  async actualizarDatos(
    @Req() req,
    @Param() params: ParamIdDto,
    @Body() usuarioDto: ActualizarUsuarioRolDto
  ) {
    const { id: idUsuario } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.actualizarDatos(
      idUsuario,
      usuarioDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Get('cuenta/desbloqueo')
  @UsePipes(ValidationPipe)
  async desbloquearCuenta(@Query() query: ParamUuidDto) {
    const { id: idDesbloqueo } = query
    const result = await this.usuarioService.desbloquearCuenta(idDesbloqueo)
    return this.successUpdate(result, Messages.SUCCESS_ACCOUNT_UNLOCK)
  }
}
