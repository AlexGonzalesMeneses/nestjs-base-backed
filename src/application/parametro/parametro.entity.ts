import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../common/entity/auditoria.entity'
import { Status } from '../../common/constants'

dotenv.config()

@Entity({ schema: process.env.DB_SCHEMA_PARAMETRICAS })
export class Parametro extends AuditoriaEntity {
  @PrimaryGeneratedColumn()
  @Column('bigint', { primary: true, name: 'id' })
  id: string

  @Column({ length: 15, type: 'varchar', unique: true })
  codigo: string

  @Column({ length: 50, type: 'varchar' })
  nombre: string

  @Column({ length: 15, type: 'varchar' })
  grupo: string

  @Column({ length: 255, type: 'varchar' })
  descripcion: string

  @Check(`_estado in ('${Status.ACTIVE}', '${Status.INACTIVE}')`)
  @Column({ length: 15, type: 'varchar', default: Status.ACTIVE })
  _estado: string
}
