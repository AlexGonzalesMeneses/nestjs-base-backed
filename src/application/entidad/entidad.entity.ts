import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ACTIVE, INACTIVE } from '../../common/constants/status';

const enumStatus = [ACTIVE, INACTIVE];

@Entity()
export class Entidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'razon_social', length: 555 })
  razonSocial: string;

  @Column({ length: 555 })
  descripcion: string;

  @Column({ length: 17 })
  nit: string;

  @Column({ length: 25 })
  sigla: string;

  @Column({ length: 55, nullable: true })
  email: string;

  @Column({ length: 55, nullable: true })
  telefonos: string;

  @Column({ length: 555, nullable: true })
  direccion: string;

  @Column({ length: 255, nullable: true })
  web: string;

  @Column({ length: 555, nullable: true })
  info: string;

  @Column({ name: 'codigo_portal_unico', length: 8, nullable: true })
  codigoPortalUnico: string;

  @Column({ type: 'enum', enum: enumStatus, default: ACTIVE })
  estado: string;
}
