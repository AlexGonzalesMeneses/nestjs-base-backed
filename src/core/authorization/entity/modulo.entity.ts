import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { PropiedadesDto } from '../dto/crear-modulo.dto'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'

dotenv.config()

@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class Modulo extends AuditoriaEntity {
  @PrimaryGeneratedColumn()
  @Column('bigint', { primary: true, name: 'id' })
  id: string

  @Column({ length: 50, type: 'varchar', unique: true })
  label: string

  @Column({ length: 50, type: 'varchar', unique: true })
  url: string

  @Column({ length: 50, type: 'varchar', unique: true })
  nombre: string

  @Column({
    type: 'jsonb',
  })
  propiedades: PropiedadesDto

  @Check(`_estado in ('${Status.ACTIVE}', '${Status.INACTIVE}')`)
  @Column({ length: 15, type: 'varchar', default: Status.ACTIVE })
  _estado: string

  @OneToMany(() => Modulo, (modulo) => modulo.fidModulo)
  subModulo: Modulo[]

  @ManyToOne(() => Modulo, (modulo) => modulo.subModulo)
  @JoinColumn({ name: 'fid_modulo', referencedColumnName: 'id' })
  fidModulo: Modulo
}
