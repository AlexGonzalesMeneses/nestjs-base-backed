import { EntityRepository, Repository } from 'typeorm';
import { Rol } from '../entity/rol.entity';

@EntityRepository(Rol)
export class RolRepository extends Repository<Rol> {}
