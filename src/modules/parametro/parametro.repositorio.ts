import { EntityRepository, Repository } from 'typeorm';
import { Parametro } from './parametro.entity';

@EntityRepository(Parametro)
export class ParametroRepositorio extends Repository<Parametro> {}
