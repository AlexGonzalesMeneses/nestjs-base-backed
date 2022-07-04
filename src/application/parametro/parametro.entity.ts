import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Status } from '../../common/constants';
import dotenv from 'dotenv';
dotenv.config();

const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Entity({ schema: process.env.DB_SCHEMA_PARAMETRICAS })
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
