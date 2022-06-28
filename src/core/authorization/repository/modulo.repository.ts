import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Modulo } from '../entity/modulo.entity';
import { CrearModuloDto, PropiedadesDto } from '../dto/crear-modulo.dto';

@EntityRepository(Modulo)
export class ModuloRepository extends Repository<Modulo> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto;
    return await this.createQueryBuilder('modulo')
      .leftJoin('modulo.fidModulo', 'fidModulo')
      .offset(saltar)
      .limit(limite)

      .select([
        'modulo.id',
        'modulo.label',
        'modulo.url',
        'modulo.nombre',
        'modulo.propiedades',
        'modulo.estado',
        'fidModulo.id',
      ])
      .where(
        filtro
          ? '(modulo.label ilike :filtro or modulo.nombre ilike :filtro)'
          : '1=1',
        {
          filtro: `%${filtro?.toLowerCase()}%`,
        },
      )
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
    propiedades.descripcion = moduloDto.propiedades.descripcion;

    //console.log('Datos........ para modulo......................', moduloDto)
    const modulo = new Modulo();
    modulo.label = moduloDto.label;
    modulo.url = moduloDto.url;
    modulo.nombre = moduloDto.nombre;
    modulo.propiedades = propiedades;
    if (moduloDto.fidModulo != '') {
      const em = new Modulo();
      em.id = moduloDto.fidModulo;
      modulo.fidModulo = em;
    }

    //console.log('Datos........ para guardar modulo......................', modulo)

    return await this.save(modulo);
  }
  async actualizar(moduloDto: CrearModuloDto) {
    const propiedades = new PropiedadesDto();
    propiedades.icono = moduloDto.propiedades.icono;
    propiedades.color_dark = moduloDto.propiedades.color_dark;
    propiedades.color_light = moduloDto.propiedades.color_light;
    propiedades.descripcion = moduloDto.propiedades.descripcion;

    const modulo = new Modulo();
    modulo.id = moduloDto.id;
    modulo.label = moduloDto.label;
    modulo.url = moduloDto.url;
    modulo.nombre = moduloDto.nombre;
    modulo.propiedades = propiedades;
    if (moduloDto.fidModulo != '') {
      const em = new Modulo();
      em.id = moduloDto.fidModulo;
      modulo.fidModulo = em;
    }

    //console.log('Datos........ para guardar modulo......................', modulo)
    return await this.save(modulo);
  }
  async eliminar(moduloDto: CrearModuloDto) {
    const modulo = new Modulo();
    modulo.id = moduloDto.id;
    return await this.delete(modulo);
  }
}
