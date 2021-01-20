import { Module } from '@nestjs/common';
import { EntidadController } from './entidad.controller';
import { EntidadService } from './entidad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntidadRepositorio } from './entidad.repositorio';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([EntidadRepositorio]), ConfigModule],
  controllers: [EntidadController],
  providers: [EntidadService, ConfigService],
  exports: [EntidadService],
})
export class EntidadModule {}
