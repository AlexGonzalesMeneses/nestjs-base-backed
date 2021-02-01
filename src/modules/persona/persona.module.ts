import { Module } from '@nestjs/common';
import { PersonaRepositorio } from './persona.repositorio';
import { PersonaService } from './persona.service';

@Module({
  providers: [PersonaService],
  exports: [PersonaService, PersonaRepositorio],
})
export class PersonaModule {}
