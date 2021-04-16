import { EntityRepository, Repository } from 'typeorm';
import { Rol } from '../entity/rol.entity';
import { ACTIVE } from '../../../common/constants/status';

@EntityRepository(Rol)
export class RolRepository extends Repository<Rol> {
  async listar() {
    const queryBuilder = await this.createQueryBuilder('rol')
      .select(['rol.id', 'rol.rol'])
      .where({ estado: ACTIVE })
      .getMany();
    return queryBuilder;
  }
}
