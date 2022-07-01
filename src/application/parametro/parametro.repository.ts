import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, Repository } from 'typeorm';
import { CrearParametroDto } from './dto/crear-parametro.dto';
import { Parametro } from './parametro.entity';

@EntityRepository(Parametro)
export class ParametroRepository extends Repository<Parametro> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto;
    return await this.createQueryBuilder('parametro')
      .select([
        'parametro.id',
        'parametro.codigo',
        'parametro.nombre',
        'parametro.grupo',
        'parametro.descripcion',
        'parametro.estado',
      ])
      .where(
        filtro
          ? '(parametro.codigo like :filtro or parametro.nombre ilike :filtro or parametro.descripcion ilike :filtro or parametro.grupo ilike :filtro)'
          : '1=1',
        {
          filtro: `%${filtro}%`,
        },
      )
      .offset(saltar)
      .limit(limite)
      .getManyAndCount();
  }

  async listarPorGrupo(grupo: string) {
    return await this.createQueryBuilder('parametro')
      .select(['parametro.id', 'parametro.codigo', 'parametro.nombre'])
      .where('parametro.grupo = :grupo', {
        grupo,
      })
      .getMany();
  }

  async crear(parametroDto: CrearParametroDto) {
    const { codigo, nombre, grupo, descripcion } = parametroDto;

    const parametro = new Parametro();
    parametro.codigo = codigo;
    parametro.nombre = nombre;
    parametro.grupo = grupo;
    parametro.descripcion = descripcion;

    return await this.save(parametro);
  }
}
