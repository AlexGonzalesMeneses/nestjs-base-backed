import { Inject, Injectable } from '@nestjs/common';
import { PersonaRepository } from '../repository/persona.repository';
import { Persona } from '../entity/persona.entity';
import { PersonaDto } from '../dto/persona.dto';

@Injectable()
export class PersonaService {
  // eslint-disable-next-line max-params
  constructor(
    @Inject(PersonaRepository)
    private personaRepositorio: PersonaRepository,
  ) {}

  async buscarPersonaPorCI(persona: PersonaDto): Promise<Persona | null> {
    return await this.personaRepositorio.buscarPersonaPorCI(persona);
  }
}
