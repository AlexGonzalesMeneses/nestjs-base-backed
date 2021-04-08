import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepositorio } from './usuario.repositorio';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PersonaRepositorio } from '../persona/persona.repositorio';

@Module({
  providers: [UsuarioService],
  exports: [UsuarioService],
  imports: [TypeOrmModule.forFeature([UsuarioRepositorio, PersonaRepositorio])],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
