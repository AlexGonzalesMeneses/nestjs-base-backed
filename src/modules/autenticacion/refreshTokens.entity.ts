import { 
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity()
export class RefreshTokens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'grant_id' })
  grantId: string

  @Column()
  iat: number;

  @Column({ name: 'expires_at'})
  expiresAt: number;

  @Column({ name: 'is_revoked' })
  isRevoked: boolean

  @Column({ type: 'jsonb' })
  data: {};
}