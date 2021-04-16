import { AbstractEntity } from '../../common/dto/abstract-entity.dto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsuarioRol } from '../../core/authorization/entity/usuario-rol.entity';
import { Persona } from '../persona/persona.entity';
import {
  ACTIVE,
  CREATE,
  INACTIVE,
  PENDING,
} from '../../common/constants/status';

const enumStatus = [CREATE, PENDING, ACTIVE, INACTIVE];

@Entity()
export class Usuario extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  usuario: string;

  @Column({ length: 255 })
  contrasena: string;

  @Column({ name: 'correo_electronico' })
  correoElectronico: string;

  @Column({
    type: 'enum',
    enum: enumStatus,
    default: CREATE,
  })
  estado: string;

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
