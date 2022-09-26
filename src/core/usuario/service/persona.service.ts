import { BaseService } from './../../../common/base/base-service'
import { Inject, Injectable } from '@nestjs/common'
import { PersonaRepository } from '../repository/persona.repository'
import { Persona } from '../entity/persona.entity'
import { PersonaDto } from '../dto/persona.dto'

@Injectable()
export class PersonaService extends BaseService {
  constructor(
    @Inject(PersonaRepository)
    private personaRepositorio: PersonaRepository
  ) {
    super(PersonaService.name)
  }

  async buscarPersonaPorCI(persona: PersonaDto): Promise<Persona | null> {
    return await this.personaRepositorio.buscarPersonaPorCI(persona)
  }
}
