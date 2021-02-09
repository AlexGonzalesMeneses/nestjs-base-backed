import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioRol } from './usuario-rol.entity';
import { RolModulo } from './rol-modulo.entity';

@Entity()
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  rol: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  estado: string;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.rol)
  public usuarioRol!: UsuarioRol[];

  @OneToMany(() => RolModulo, (rolModulo) => rolModulo.rol)
  public rolModulo!: RolModulo[];
}
