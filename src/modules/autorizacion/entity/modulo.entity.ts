import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolModulo } from './rol-modulo.entity';

@Entity()
export class Modulo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  label: string;

  @Column({ length: 50, unique: true })
  url: string;

  @Column({ length: 50, unique: true })
  icono: string;

  @Column({ length: 50, unique: true })
  nombre: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  estado: string;

  @OneToMany(() => RolModulo, (rolModulo) => rolModulo.modulo)
  public rolModulo!: RolModulo[];
}
