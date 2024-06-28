import { UtilService } from '@/common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'
import { FacturaEstado } from '../constant'

dotenv.config()

@Check(UtilService.buildStatusCheck(FacturaEstado))
@Entity({ name: 'clientes', schema: process.env.DB_SCHEMA_PARAMETRICAS })
export class Cliente extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Cliente',
  })
  id: string

  @Column({
    length: 15,
    type: 'varchar',
    unique: true,
    comment: 'Código de cliente',
  })
  codigo: string

  @Column({ length: 50, type: 'varchar', comment: 'Nombre de cliente' })
  nombre: string

  @Column({ length: 50, type: 'varchar', comment: 'Apellido de cliente' })
  apellido: string

  constructor(data?: Partial<Cliente>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || FacturaEstado.ACTIVO
  }
}
