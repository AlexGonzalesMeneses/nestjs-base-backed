import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Parametro extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 555 })
  codigo: string;

  @Column({ length: 555 })
  nombre: string;

  @Column({ length: 17 })
  grupo: string;

  @Column({ length: 255 })
  descripcion: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  estado: string;
}
