import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Check,
} from 'typeorm'
import { UsuarioRol } from './usuario-rol.entity'
import { Status } from '../../../common/constants'
import dotenv from 'dotenv'
dotenv.config()

@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50, type: 'varchar', unique: true })
  rol: string

  @Column({ length: 100, type: 'varchar' })
  nombre: string

  @Check(`estado in ('${Status.ACTIVE}', '${Status.INACTIVE}')`)
  @Column({ length: 15, type: 'varchar', default: Status.ACTIVE })
  estado: string

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.rol)
  public usuarioRol!: UsuarioRol[]
}
