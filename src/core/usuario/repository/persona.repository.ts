import { EntityRepository, Repository } from 'typeorm';
import { Persona } from '../entity/persona.entity';

@EntityRepository(Persona)
export class PersonaRepository extends Repository<Persona> {}
