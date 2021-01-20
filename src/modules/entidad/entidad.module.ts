import { Module } from '@nestjs/common';
import { EntidadController } from './entidad.controller';
import { EntidadService } from './entidad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntidadRepositorio } from './entidad.repositorio';

@Module({
  controllers: [EntidadController],
  providers: [EntidadService],
  imports: [TypeOrmModule.forFeature([EntidadRepositorio])],
})
export class EntidadModule {}
