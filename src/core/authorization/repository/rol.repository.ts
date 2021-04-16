import { EntityRepository, Repository } from 'typeorm';
import { Rol } from '../entity/rol.entity';
import { Status } from '../../../common/constants';

@EntityRepository(Rol)
export class RolRepository extends Repository<Rol> {
  async listar() {
    const queryBuilder = await this.createQueryBuilder('rol')
      .select(['rol.id', 'rol.rol'])
      .where({ estado: Status.ACTIVE })
      .getMany();
    return queryBuilder;
  }
}
