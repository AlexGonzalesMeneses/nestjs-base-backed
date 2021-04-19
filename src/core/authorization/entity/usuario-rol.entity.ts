import { Usuario } from '../../../application/usuario/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rol } from './rol.entity';
import { Status } from '../../../common/constants';

const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Entity()
export class UsuarioRol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarioRol)
  @JoinColumn({ name: 'id_rol', referencedColumnName: 'id' })
  public rol!: Rol;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioRol)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  public usuario!: Usuario;
}
