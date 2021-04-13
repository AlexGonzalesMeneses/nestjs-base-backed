import { EntityRepository, Repository } from 'typeorm';
import { Rol } from '../entity/rol.entity';

@EntityRepository(Rol)
export class RolRepository extends Repository<Rol> {
  async listar() {
    const queryBuilder = await this.createQueryBuilder('rol')
      .select(['rol.id', 'rol.rol'])
      .where({ estado: 'ACTIVO' })
      .getMany();
    return queryBuilder;
  }
}
