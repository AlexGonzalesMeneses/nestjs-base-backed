import { EntityRepository, Repository } from 'typeorm';
import { Modulo } from '../entity/modulo.entity';

@EntityRepository(Modulo)
export class ModuloRepository extends Repository<Modulo> {}
