import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Modulo } from './modulo.entity';
import { Rol } from './rol.entity';
import { ACTIVE, INACTIVE } from '../../../common/constants/status';

const enumStatus = [ACTIVE, INACTIVE];

@Entity()
export class RolModulo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: enumStatus, default: ACTIVE })
  estado: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarioRol)
  @JoinColumn({ name: 'id_rol', referencedColumnName: 'id' })
  public rol!: Rol;

  @ManyToOne(() => Modulo, (modulo) => modulo.rolModulo)
  @JoinColumn({ name: 'id_modulo', referencedColumnName: 'id' })
  public modulo!: Modulo;
}
