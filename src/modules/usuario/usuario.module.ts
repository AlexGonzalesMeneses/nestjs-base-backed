import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepositorio } from './usuario.repositorio';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';

@Module({
  providers: [UsuarioService],
  exports: [UsuarioService],
  imports: [TypeOrmModule.forFeature([UsuarioRepositorio])],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
