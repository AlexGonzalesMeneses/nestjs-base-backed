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
import { ParamIdDto } from '../../../common/dto/params-id.dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

@Controller('usuarios')
@ApiTags('Usuarios')
export class UsuarioController extends BaseController {
  constructor(private usuarioService: UsuarioService) {
    super()
  }

  // GET users
  @ApiOperation({ summary: 'API para obtener el listado de usuarios' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get()
  async listar(@Query() paginacionQueryDto: FiltrosUsuarioDto) {
    const result = await this.usuarioService.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'Obtiene la información del perfil del usuario' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('/cuenta/perfil')
  async obtenerPerfil(@Request() req) {
    const user = req.user
    const result = await this.usuarioService.buscarUsuarioPerfil(
      user.id,
      user.idRol
    )
    return this.success(result)
  }

  //create user
  @ApiOperation({ summary: 'API para crear un nuevo usuario' })
  @ApiBearerAuth()
  @ApiBody({
    type: CrearUsuarioDto,
    description: 'new Usuario',
    required: true,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post()
  async crear(@Req() req, @Body() usuarioDto: CrearUsuarioDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.crear(usuarioDto, usuarioAuditoria)
    return this.successCreate(result)
  }

  //create user account
  @ApiOperation({ summary: 'API para crear una nueva Cuenta' })
  @ApiBearerAuth()
  @ApiBody({
    type: CrearUsuarioDto,
    description: 'Nueva cuenta de usuario',
    required: true,
  })
  @Post('crear-cuenta')
  async crearUsuario(@Req() req, @Body() usuarioDto: CrearUsuarioCuentaDto) {
    const result = await this.usuarioService.crearCuenta(usuarioDto)
    return this.successCreate(result, Messages.NEW_USER_ACCOUNT)
  }

  //restore user account
  @ApiOperation({ summary: 'API para recuperar una Cuenta' })
  @ApiBearerAuth()
  @ApiBody({
    type: RecuperarCuentaDto,
    description: 'Cuenta',
    required: true,
  })
  @Post('recuperar')
  async recuperarCuenta(
    @Req() req,
    @Body() recuperarCuentaDto: RecuperarCuentaDto
  ) {
    const result = await this.usuarioService.recuperarCuenta(recuperarCuentaDto)
    return this.success(result, Messages.SUBJECT_EMAIL_ACCOUNT_RECOVERY)
  }

  // validate restore user account
  @ApiOperation({ summary: 'API para validar recuperación una Cuenta' })
  @ApiBearerAuth()
  @ApiBody({
    type: ValidarRecuperarCuentaDto,
    description: 'Cuenta',
    required: true,
  })
  @Post('validar-recuperar')
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
  @ApiOperation({ summary: 'API para activar una Cuenta' })
  @ApiBearerAuth()
  @ApiBody({
    type: ActivarCuentaDto,
    description: 'Cuenta',
    required: true,
  })
  @Patch('/cuenta/activacion')
  async activarCuenta(@Req() req, @Body() activarCuentaDto: ActivarCuentaDto) {
    const result = await this.usuarioService.activarCuenta(
      activarCuentaDto.codigo
    )
    return this.successUpdate(result, Messages.ACCOUNT_ACTIVED_SUCCESSFULLY)
  }

  // validate restore user account
  @ApiOperation({ summary: 'API para nueva Contraseña' })
  @ApiBearerAuth()
  @ApiBody({
    type: NuevaContrasenaDto,
    description: 'Cuenta',
    required: true,
  })
  @Patch('/cuenta/nueva-contrasena')
  async nuevaContrasena(
    @Req() req,
    @Body() nuevaContrasenaDto: NuevaContrasenaDto
  ) {
    const result = await this.usuarioService.nuevaContrasenaTransaccion(
      nuevaContrasenaDto
    )
    return this.success(result, Messages.SUCCESS_DEFAULT)
  }

  @ApiOperation({
    summary:
      'API para crear un nuevo usuario relacionado con Ciudadanía Digital',
  })
  @ApiBearerAuth()
  @ApiBody({
    type: CrearUsuarioCiudadaniaDto,
    required: true,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post('/cuenta/ciudadania')
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
  @ApiOperation({ summary: 'Activa un usuario' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/activacion')
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
  @ApiOperation({ summary: 'Inactiva un usuario' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
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

  @ApiOperation({
    summary: 'Actualiza la contrasena de un usuario authenticado',
  })
  @ApiBearerAuth()
  @ApiBody({
    type: ActualizarContrasenaDto,
    description: 'new Rol',
    required: true,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
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

  @ApiOperation({ summary: 'API para restaurar la contraseña de un usuario' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
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

  @ApiOperation({ summary: 'API para reenviar Correo Activación' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/reenviar')
  async reenviarCorreoActivacion(@Req() req, @Param() params: ParamIdDto) {
    const usuarioAuditoria = this.getUser(req)
    const { id: idUsuario } = params
    const result = await this.usuarioService.reenviarCorreoActivacion(
      idUsuario,
      usuarioAuditoria
    )
    return this.successUpdate(result, Messages.SUCCESS_RESEND_MAIL_ACTIVATION)
  }

  //update user
  @ApiOperation({ summary: 'Actualiza datos de un usuario' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarUsuarioRolDto,
    description: 'Usuario',
    required: true,
  })
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

  @ApiOperation({
    summary: 'Desbloquea una cuenta bloqueada por muchos intentos fallidos',
  })
  @ApiQuery({
    name: 'id',
    type: ParamUuidDto,
  })
  @Get('cuenta/desbloqueo')
  async desbloquearCuenta(@Query() query: ParamUuidDto) {
    const { id: idDesbloqueo } = query
    const result = await this.usuarioService.desbloquearCuenta(idDesbloqueo)
    return this.successUpdate(result, Messages.SUCCESS_ACCOUNT_UNLOCK)
  }
}
