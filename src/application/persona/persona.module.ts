import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaRepository } from './persona.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PersonaRepository])],
  providers: [],
  exports: [PersonaRepository],
})
export class PersonaModule {}
