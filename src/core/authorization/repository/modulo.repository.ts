import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Modulo } from '../entity/modulo.entity';
import { CrearModuloDto } from '../dto/crear-modulo.dto';
@EntityRepository(Modulo)
export class ModuloRepository extends Repository<Modulo> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto;
    const queryBuilder = await this.createQueryBuilder('modulo')
      .offset(saltar)
      .limit(limite)
      .getManyAndCount();
    return queryBuilder;
  }

  async listarTodo() {
    const queryBuilder = await this.createQueryBuilder('modulo').getMany();
    return queryBuilder;
  }

  async crear(moduloDto: CrearModuloDto) {
    const modulo = new Modulo();
    modulo.label = moduloDto.label;
    modulo.url = moduloDto.url;
    modulo.icono = moduloDto.icono;
    modulo.nombre = moduloDto.nombre;

    return this.save(modulo);
  }
}
