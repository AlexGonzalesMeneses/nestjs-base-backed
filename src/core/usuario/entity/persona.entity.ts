import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Status } from '../../../common/constants';

const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Entity()
export class Persona {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, type: 'varchar', nullable: true })
  nombres: string | null;

  @Column({
    name: 'primer_apellido',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  primerApellido: string | null;

  @Column({
    name: 'segundo_apellido',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  segundoApellido: string | null;

  @Column({
    name: 'tipo_documento',
    type: 'enum',
    enum: ['CI', 'PASAPORTE', 'OTRO'],
    default: 'CI',
  })
  tipoDocumento: string;

  @Column({
    name: 'tipo_documento_otro',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  tipoDocumentoOtro: string | null;

  @Column({ name: 'nro_documento', length: 50 })
  nroDocumento: string;

  @Column({
    name: 'fecha_nacimiento',
    type: 'date',
    nullable: true,
  })
  fechaNacimiento: string | null;

  @Column({ length: 50, type: 'varchar', nullable: true })
  telefono: string | null;

  @Column({ type: 'enum', enum: ['M', 'F', 'OTRO'], nullable: true })
  genero: string | null;

  @Column({ length: 255, type: 'varchar', nullable: true })
  observacion: string | null;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @OneToMany(() => Usuario, (usuario) => usuario.persona)
  usuarios: Usuario[];
}
