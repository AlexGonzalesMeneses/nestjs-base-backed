import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Status } from '../../common/constants';

const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Entity()
export class Persona {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: true })
  nombres: string;

  @Column({ name: 'primer_apellido', length: 100, nullable: true })
  primerApellido: string;

  @Column({ name: 'segundo_apellido', length: 100, nullable: true })
  segundoApellido: string;

  @Column({
    name: 'tipo_documento',
    type: 'enum',
    enum: ['CI', 'PASAPORTE', 'OTRO'],
    default: 'CI',
  })
  tipoDocumento: string;

  @Column({ name: 'tipo_documento_otro', length: 50, nullable: true })
  tipoDocumentoOtro: string;

  @Column({ name: 'nro_documento', length: 50 })
  nroDocumento: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento: string;

  @Column({ length: 50, nullable: true })
  telefono: string;

  @Column({ type: 'enum', enum: ['M', 'F', 'OTRO'], nullable: true })
  genero: string;

  @Column({ length: 255, nullable: true })
  observacion: string;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @OneToMany(() => Usuario, (usuario) => usuario.persona)
  usuarios: Usuario[];
}
