import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PersonaRepository } from '../persona/persona.repository';
import { MensajeriaModule } from '../../core/external-services/mensajeria/mensajeria.module';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from '../../core/authorization/authorization.module';

@Module({
  providers: [UsuarioService],
  exports: [UsuarioService],
  imports: [
    TypeOrmModule.forFeature([UsuarioRepository, PersonaRepository]),
    MensajeriaModule,
    ConfigModule,
    AuthorizationModule,
  ],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
