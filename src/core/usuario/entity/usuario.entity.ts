import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsuarioRol } from '../../authorization/entity/usuario-rol.entity';
import { Persona } from './persona.entity';
import { Status } from '../../../common/constants';

const enumStatus = [
  Status.CREATE,
  Status.PENDING,
  Status.ACTIVE,
  Status.INACTIVE,
];

@Entity()
export class Usuario extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, type: 'varchar', unique: true })
  usuario: string;

  @Column({ length: 255, type: 'varchar' })
  contrasena: string;

  @Column({ name: 'ciudadania_digital', type: 'boolean', default: false })
  ciudadaniaDigital: boolean;

  @Column({ name: 'correo_electronico', type: 'varchar', nullable: true })
  correoElectronico: string | null;

  @Column({
    type: 'enum',
    enum: enumStatus,
    default: Status.CREATE,
  })
  estado: string;

  @Column({
    type: 'integer',
    default: 0,
  })
  intentos: number;

  @Column({
    name: 'codigo_desbloqueo',
    length: 100,
    nullable: true,
    type: 'varchar',
  })
  codigoDesbloqueo: string | null;

  @Column({
    name: 'fecha_bloqueo',
    type: 'timestamptz',
    nullable: true,
  })
  fechaBloqueo: Date | null;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario, {
    cascade: true,
  })
  public usuarioRol!: UsuarioRol[];

  @ManyToOne(() => Persona, (persona) => persona.usuarios, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({
    name: 'id_persona',
    referencedColumnName: 'id',
  })
  persona: Persona;
}
