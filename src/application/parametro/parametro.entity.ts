import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { ACTIVE, INACTIVE } from '../../common/constants/status';

const enumStatus = [ACTIVE, INACTIVE];

@Entity()
export class Parametro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 15, unique: true })
  codigo: string;

  @Column({ length: 50 })
  nombre: string;

  @Column({ length: 15 })
  grupo: string;

  @Column({ length: 255 })
  descripcion: string;

  @Column({ type: 'enum', enum: enumStatus, default: ACTIVE })
  estado: string;
}
