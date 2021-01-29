import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  recuperar(): Promise<Usuario[]> {
    // console.log(typeof Usuario);
    return this.usuarioService.recuperar();
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usuarioService.buscarUsuarioId(req.user.id);
  }
}
