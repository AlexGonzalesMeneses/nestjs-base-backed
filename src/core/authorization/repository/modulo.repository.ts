import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { DataSource } from 'typeorm';
import { Modulo } from '../entity/modulo.entity';
import { CrearModuloDto, PropiedadesDto } from '../dto/crear-modulo.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModuloRepository {
  constructor(private dataSource: DataSource) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto;
    return await this.dataSource
      .getRepository(Modulo)
      .createQueryBuilder('modulo')
      .leftJoin('modulo.fidModulo', 'fidModulo')
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
      .offset(saltar)
      .limit(limite)
      .getManyAndCount();
  }

  async listarTodo() {
    return await this.dataSource
      .getRepository(Modulo)
      .createQueryBuilder('modulo')
      .getMany();
  }

  async obtenerModulosSubmodulos() {
    return await this.dataSource
      .getRepository(Modulo)
      .createQueryBuilder('modulo')
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

    return await this.dataSource.getRepository(Modulo).save(modulo);
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
    return await this.dataSource.getRepository(Modulo).save(modulo);
  }
  async eliminar(moduloDto: CrearModuloDto) {
    const modulo = new Modulo();
    modulo.id = moduloDto.id;
    return await this.dataSource.getRepository(Modulo).delete(modulo);
  }
}
