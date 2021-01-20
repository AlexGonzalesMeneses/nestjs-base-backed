import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('entidad')
export class Entidad extends BaseEntity {
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

  @Column({ length: 55 })
  email: string;

  @Column({ length: 55 })
  telefonos: string;

  @Column({ length: 555 })
  direccion: string;

  @Column({ length: 255 })
  web: string;

  @Column({ length: 555 })
  info: string;

  @Column({ name: 'codigo_portal_unico', length: 8 })
  codigoPortalUnico: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  estado: string;
}
