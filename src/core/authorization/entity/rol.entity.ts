import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UsuarioRol } from './usuario-rol.entity'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'

dotenv.config()

@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class Rol extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ length: 50, type: 'varchar', unique: true })
  rol: string

  @Column({ length: 100, type: 'varchar' })
  nombre: string

  @Check(
    `_estado in (
      '${Status.ACTIVE}',
      '${Status.INACTIVE}'
    )`
  )
  estado: string

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.rol)
  usuarioRol: UsuarioRol[]

  constructor(data?: Partial<Rol>) {
    super(data)
  }
}
