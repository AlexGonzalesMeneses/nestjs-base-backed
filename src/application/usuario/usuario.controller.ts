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
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard';
import { UsuarioDto } from './dto/usuario.dto';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
export class UsuarioController extends AbstractController {
  constructor(private usuarioService: UsuarioService) {
    super();
  }
  // GET users
  @UseGuards(JwtAuthGuard)
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.usuarioService.listar(paginacionQueryDto);
    return this.successList(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async getProfile(@Request() req) {
    const idUsuario = this.getUser(req);
    const result = await this.usuarioService.buscarUsuarioId(idUsuario);
    return this.successList(result);
  }

  //create user
  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async crear(@Req() req: Request, @Body() usuarioDto: CrearUsuarioDto) {
    const usuarioAuditoria = this.getUser(req);
    const result = await this.usuarioService.crear(
      usuarioDto,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  @UseGuards(JwtAuthGuard)
  // activar usuario
  @Patch('/activacion/:id')
  async activar(@Param() param) {
    const { id } = param;
    const result = await this.usuarioService.activar(id);
    return this.successUpdate(result);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/contrasena')
  async actualizarContrasena(@Req() req: Request, @Body() body) {
    const idUsuario = this.getUser(req);
    const { contrasenaActual, contrasenaNueva } = body;
    const result = await this.usuarioService.actualizarContrasena(
      idUsuario,
      contrasenaActual,
      contrasenaNueva,
    );
    return this.successUpdate(result);
  }

  //update user
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() usuarioDto: UsuarioDto) {
    const result = await this.usuarioService.update(id, usuarioDto);
    return this.successCreate(result);
  }

  //delete user
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.usuarioService.remove(id);
    return this.successDelete(result);
  }
}
