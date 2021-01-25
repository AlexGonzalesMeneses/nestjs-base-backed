import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { RolController } from './controller/rol.controller';
import { RolService } from './service/rol.service';
import { RolRepository } from './repository/rol.repository';
import { RolController } from './controller/rol.controller';
import { ModuloRepository } from './repository/modulo.repository';
import { ModuloController } from './controller/modulo.controller';
import { ModuloService } from './service/modulo.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './rol.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolRepository, ModuloRepository]),
    ConfigModule,
  ],
  controllers: [RolController, ModuloController],
  providers: [
    RolService,
    ModuloService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AutorizacionModule {}
