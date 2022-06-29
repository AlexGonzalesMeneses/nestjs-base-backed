import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Status } from '../../common/constants';

const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Entity()
export class Parametro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 15, type: 'varchar', unique: true })
  codigo: string;

  @Column({ length: 50, type: 'varchar' })
  nombre: string;

  @Column({ length: 15, type: 'varchar' })
  grupo: string;

  @Column({ length: 255, type: 'varchar' })
  descripcion: string;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;
}
