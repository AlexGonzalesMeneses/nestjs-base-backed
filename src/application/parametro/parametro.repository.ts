import { EntityRepository, Repository } from 'typeorm';
import { Parametro } from './parametro.entity';

@EntityRepository(Parametro)
export class ParametroRepository extends Repository<Parametro> {}
