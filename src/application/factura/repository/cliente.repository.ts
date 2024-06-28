import { Brackets, DataSource, UpdateResult } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { CrearClienteDto, ActualizarClienteDto } from '../dto'
import { Cliente } from '../entity'

@Injectable()
export class ClienteRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string): Promise<Cliente | null> {
    return await this.dataSource
      .getRepository(Cliente)
      .createQueryBuilder('cliente')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    clienteDto: ActualizarClienteDto,
    usuarioAuditoria: string
  ): Promise<UpdateResult> {
    const datosActualizar = new Cliente({
      ...clienteDto,
      usuarioModificacion: usuarioAuditoria,
    })

    return await this.dataSource
      .getRepository(Cliente)
      .update(id, datosActualizar)
  }

  async listar(
    paginacionQueryDto: PaginacionQueryDto
  ): Promise<[Cliente[], number]> {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Cliente)
      .createQueryBuilder('cliente')
      .select([
        'cliente.id',
        'cliente.codigo',
        'cliente.nombre',
        'cliente.apellido',
        'cliente.estado',
      ])
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'codigo':
        query.addOrderBy('cliente.codigo', sentido)
        break
      case 'nombre':
        query.addOrderBy('cliente.nombre', sentido)
        break
      case 'descripcion':
        query.addOrderBy('cliente.apellido', sentido)
        break
      case 'estado':
        query.addOrderBy('cliente.estado', sentido)
        break
      default:
        query.orderBy('cliente.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('cliente.codigo like :filtro', { filtro: `%${filtro}%` })
          qb.orWhere('cliente.nombre ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('cliente.apellido ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async buscarCodigo(codigo: string): Promise<Cliente | null> {
    return await this.dataSource
      .getRepository(Cliente)
      .findOne({ where: { codigo: codigo } })
  }

  async crear(
    clienteDto: CrearClienteDto,
    usuarioAuditoria: string
  ): Promise<Cliente> {
    const { nombre, apellido, codigo } = clienteDto

    const cliente = new Cliente()
    cliente.codigo = codigo
    cliente.nombre = nombre
    cliente.apellido = apellido
    cliente.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Cliente).save(cliente)
  }
}
