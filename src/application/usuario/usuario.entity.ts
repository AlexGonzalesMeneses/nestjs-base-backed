import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsuarioRol } from '../autorizacion/entity/usuario-rol.entity';
import { Persona } from '../persona/persona.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  usuario: string;

  @Column({ length: 255 })
  contrasena: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  estado: string;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario)
  public usuarioRol!: UsuarioRol[];

  @ManyToOne(() => Persona, (persona) => persona.usuarios, { nullable: false })
  @JoinColumn({
    name: 'id_persona',
    referencedColumnName: 'id',
  })
  persona: Persona;
}
