import { Usuario } from 'src/modules/usuario/usuario.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rol } from './rol.entity';

@Entity()
export class UsuarioRol extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  estado: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarioRol)
  @JoinColumn({ name: 'id_rol', referencedColumnName: 'id' })
  public rol!: Rol;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioRol)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  public usuario!: Usuario;
}
