import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepository } from './repository/usuario.repository';
import { UsuarioService } from './service/usuario.service';
import { UsuarioController } from './controller/usuario.controller';
import { PersonaRepository } from './repository/persona.repository';
import { MensajeriaModule } from '../external-services/mensajeria/mensajeria.module';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from '../authorization/authorization.module';
import { UsuarioRolRepository } from '../authorization/repository/usuario-rol.repository';
import { IopModule } from '../external-services/iop/iop.module';

@Module({
  providers: [UsuarioService],
  exports: [UsuarioService],
  imports: [
    TypeOrmModule.forFeature([
      UsuarioRepository,
      PersonaRepository,
      UsuarioRolRepository,
    ]),
    MensajeriaModule,
    IopModule,
    ConfigModule,
    AuthorizationModule,
  ],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
