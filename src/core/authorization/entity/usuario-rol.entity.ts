import { Usuario } from '../../usuario/entity/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Rol } from './rol.entity';
import { Status } from '../../../common/constants';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import dotenv from 'dotenv';
dotenv.config();

@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class UsuarioRol extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Check(`estado in ('${Status.ACTIVE}', '${Status.INACTIVE}')`)
  @Column({ length: 15, type: 'varchar', default: Status.ACTIVE })
  estado: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarioRol)
  @JoinColumn({ name: 'id_rol', referencedColumnName: 'id' })
  public rol!: Rol;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioRol)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  public usuario!: Usuario;
}
