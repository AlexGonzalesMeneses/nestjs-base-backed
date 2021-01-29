import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SUCCESS_CREATE, SUCCESS_DELETE, SUCCESS_LIST, SUCCESS_UPDATE } from 'src/common/constants';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { successResponse } from 'src/common/lib/http.module';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';
import { UsuarioDto } from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}
  // GET users
  @UseGuards(JwtAuthGuard)
  @Get()
  async recuperar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    return successResponse(
      await this.usuarioService.recuperar(paginacionQueryDto),
      SUCCESS_LIST,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  //create user
  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async guardar(@Body() usuarioDto: UsuarioDto) {
    return successResponse(
      await this.usuarioService.guardar(usuarioDto),
      SUCCESS_CREATE,
    );
  }
  //update user
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() usuarioDto: UsuarioDto) {
    return successResponse(
      await this.usuarioService.update(id, usuarioDto),
      SUCCESS_UPDATE,
    );
  }
  
  //delete user
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return successResponse(
      await this.usuarioService.remove(id),
      SUCCESS_DELETE,
    );
  }  
}
