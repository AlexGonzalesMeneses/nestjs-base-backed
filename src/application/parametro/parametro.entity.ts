import { Entity, PrimaryGeneratedColumn, Column, Check } from 'typeorm';

import { Status } from '../../common/constants';
import dotenv from 'dotenv';
dotenv.config();

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

  @Check(`estado in ('${Status.ACTIVE}', '${Status.INACTIVE}')`)
  @Column({ length: 15, type: 'varchar', default: Status.ACTIVE })
  estado: string;
}
