import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Entidad } from './entidad.entity';

@EntityRepository(Entidad)
export class EntidadRepository extends Repository<Entidad> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto;

    const queryBuilder = await this.createQueryBuilder('entidad')
      .select([
        'entidad.razonSocial',
        'entidad.descripcion',
        'entidad.nit',
        'entidad.estado',
      ])
      .offset(saltar)
      .limit(limite)
      .getManyAndCount();
    return queryBuilder;
  }
}
