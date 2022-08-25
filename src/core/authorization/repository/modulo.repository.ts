import { DataSource } from 'typeorm'
import { Modulo } from '../entity/modulo.entity'
import {
  CrearModuloDto,
  FiltroModuloDto,
  PropiedadesDto,
} from '../dto/crear-modulo.dto'
import { Injectable } from '@nestjs/common'
import { Status } from '../../../common/constants'

@Injectable()
export class ModuloRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string): Promise<Modulo | null> {
    return await this.dataSource
      .getRepository(Modulo)
      .createQueryBuilder('modulo')
      .where({ id: id })
      .getOne()
  }

  async listar(paginacionQueryDto: FiltroModuloDto) {
    const { limite, saltar, filtro, seccion } = paginacionQueryDto
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
        'modulo._estado',
        'fidModulo.id',
      ])
      .where(
        filtro
          ? '(modulo.label ilike :filtro or modulo.nombre ilike :filtro)'
          : '1=1',
        {
          filtro: `%${filtro?.toLowerCase()}%`,
        }
      )
      .andWhere(seccion ? '(modulo.fidModulo is null)' : '1=1')
      .take(limite)
      .skip(saltar)
      .orderBy('modulo.id', 'ASC')
      .getManyAndCount()
  }

  async listarTodo() {
    return await this.dataSource
      .getRepository(Modulo)
      .createQueryBuilder('modulo')
      .getMany()
  }

  async obtenerModulosSubmodulos() {
    return await this.dataSource
      .getRepository(Modulo)
      .createQueryBuilder('modulo')
      .leftJoinAndSelect(
        'modulo.subModulo',
        'subModulo',
        'subModulo._estado = :estado',
        {
          _estado: Status.ACTIVE,
        }
      )
      .orderBy('subModulo.id', 'ASC')
      .select([
        'modulo.id',
        'modulo.label',
        'modulo.url',
        'modulo.nombre',
        'modulo.propiedades',
        'modulo._estado',
        'subModulo.id',
        'subModulo.label',
        'subModulo.url',
        'subModulo.nombre',
        'subModulo.propiedades',
        'subModulo._estado',
      ])
      .where('modulo.fid_modulo is NULL')
      .andWhere('modulo._estado = :estado', {
        _estado: Status.ACTIVE,
      })
      .orderBy('modulo.id', 'ASC')
      .getMany()
  }

  async crear(moduloDto: CrearModuloDto, usuarioAuditoria: string) {
    const propiedades = new PropiedadesDto()
    propiedades.icono = moduloDto.propiedades.icono
    propiedades.color_dark = moduloDto.propiedades.color_dark
    propiedades.color_light = moduloDto.propiedades.color_light
    propiedades.descripcion = moduloDto.propiedades.descripcion

    //console.log('Datos........ para modulo......................', moduloDto)
    const modulo = new Modulo()
    modulo.label = moduloDto.label
    modulo.url = moduloDto.url
    modulo.nombre = moduloDto.nombre
    modulo.propiedades = propiedades
    modulo._usuarioCreacion = usuarioAuditoria
    modulo._fechaCreacion = new Date()
    if (moduloDto.fidModulo != '') {
      const em = new Modulo()
      em.id = moduloDto.fidModulo
      modulo.fidModulo = em
    }

    //console.log('Datos........ para guardar modulo......................', modulo)

    return await this.dataSource.getRepository(Modulo).save(modulo)
  }

  async actualizar(moduloDto: Partial<Modulo>) {
    return await this.dataSource.getRepository(Modulo).save(moduloDto)
  }

  async eliminar(moduloDto: CrearModuloDto) {
    return await this.dataSource.getRepository(Modulo).delete(moduloDto.id)
  }
}
