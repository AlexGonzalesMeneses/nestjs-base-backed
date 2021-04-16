import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationController } from './controller/authorization.controller';
import { AuthorizationServive } from './controller/authorization.service';
import { ModuloController } from './controller/modulo.controller';
import { RolController } from './controller/rol.controller';
import { ModuloRepository } from './repository/modulo.repository';
import { RolRepository } from './repository/rol.repository';
import { ModuloService } from './service/modulo.service';
import { RolService } from './service/rol.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([RolRepository, ModuloRepository]),
    ConfigModule,
  ],
  controllers: [AuthorizationController, RolController, ModuloController],
  providers: [RolService, ModuloService, ConfigService, AuthorizationServive],
})
export class AuthorizationModule {}
