import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Status } from '../../../common/constants';
import { PropiedadesDto } from '../dto/crear-modulo.dto';

const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Entity()
export class Modulo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  label: string;

  @Column({ length: 50, unique: true })
  url: string;

  @Column({ length: 50, unique: true })
  nombre: string;

  @Column({
    type: 'jsonb',
  })
  propiedades: PropiedadesDto;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;
}
