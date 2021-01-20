import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepositorio } from './usuario.repositorio';
import { UsuarioService } from './usuario.service';

@Module({
  providers: [UsuarioService],
  exports: [UsuarioService],
  imports: [TypeOrmModule.forFeature([UsuarioRepositorio])],
})
export class UsuarioModule {}
