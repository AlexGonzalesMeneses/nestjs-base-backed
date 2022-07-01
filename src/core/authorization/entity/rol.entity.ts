import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioRol } from './usuario-rol.entity';
import { Status } from '../../../common/constants';
import dotenv from 'dotenv';
dotenv.config();


const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, type: 'varchar', unique: true })
  rol: string;

  @Column({ length: 100, type: 'varchar' })
  nombre: string;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.rol)
  public usuarioRol!: UsuarioRol[];
}
