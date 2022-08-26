import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'

dotenv.config()

export type Propiedades = {
  icono?: string
  descripcion?: string
  color_light?: string
  color_dark?: string
}

@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class Modulo extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 50, type: 'varchar', unique: true })
  label: string

  @Column({ length: 50, type: 'varchar', unique: true })
  url: string

  @Column({ length: 50, type: 'varchar', unique: true })
  nombre: string

  @Column({ type: 'jsonb' })
  propiedades: Propiedades

  @Column({
    name: 'fid_modulo',
    type: 'bigint',
    nullable: true,
  })
  idModulo?: string | null

  @Check(
    `_estado in (
      '${Status.ACTIVE}',
      '${Status.INACTIVE}'
    )`
  )
  estado: string

  @OneToMany(() => Modulo, (modulo) => modulo.fidModulo)
  subModulo: Modulo[]

  @ManyToOne(() => Modulo, (modulo) => modulo.subModulo)
  @JoinColumn({ name: 'fid_modulo', referencedColumnName: 'id' })
  fidModulo: Modulo

  constructor(data?: Partial<Modulo>) {
    super(data)
  }
}
