import { Injectable } from '@nestjs/common';
import { PersonaRepository } from '../repository/persona.repository';
import { Persona } from '../entity/persona.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonaDto } from '../dto/persona.dto';

@Injectable()
export class PersonaService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(PersonaRepository)
    private personaRepositorio: PersonaRepository,
  ) {}

  async buscarPersonaPorCI(persona: PersonaDto): Promise<Persona> {
    return this.personaRepositorio.buscarPersonaPorCI(persona);
  }
}
