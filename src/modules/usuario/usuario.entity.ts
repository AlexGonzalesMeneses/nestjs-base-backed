import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { UsuarioRol } from '../autorizacion/entity/usuario-rol.entity';

@Entity()
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  usuario: string;

  @Column({ length: 255 })
  contrasena: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  estado: string;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario)
  public usuarioRol!: UsuarioRol[];
}
