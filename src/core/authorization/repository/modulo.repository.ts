import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Modulo } from '../entity/modulo.entity';
import { CrearModuloDto, PropiedadesDto } from '../dto/crear-modulo.dto';

@EntityRepository(Modulo)
export class ModuloRepository extends Repository<Modulo> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto;
    return await this.createQueryBuilder('modulo')
      .offset(saltar)
      .limit(limite)
      .getManyAndCount();
  }

  async listarTodo() {
    return await this.createQueryBuilder('modulo').getMany();
  }

  async obtenerModulosSubmodulos() {
    return await this.createQueryBuilder('modulo')
      .leftJoinAndSelect('modulo.subModulo', 'subModulo')
      .where('modulo.fid_modulo is NULL')
      .getMany();
  }

  async crear(moduloDto: CrearModuloDto) {
    const propiedades = new PropiedadesDto();
    propiedades.icono = moduloDto.propiedades.icono;
    propiedades.color_dark = moduloDto.propiedades.color_dark;
    propiedades.color_light = moduloDto.propiedades.color_light;

    const modulo = new Modulo();
    modulo.label = moduloDto.label;
    modulo.url = moduloDto.url;
    modulo.nombre = moduloDto.nombre;
    modulo.propiedades = propiedades;

    return await this.save(modulo);
  }
}
