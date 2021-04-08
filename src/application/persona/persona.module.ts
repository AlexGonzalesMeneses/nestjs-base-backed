import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaRepositorio } from './persona.repositorio';
import { PersonaService } from './persona.service';

@Module({
  imports: [TypeOrmModule.forFeature([PersonaRepositorio])],
  providers: [PersonaService],
  exports: [PersonaService, PersonaRepositorio],
})
export class PersonaModule {}
