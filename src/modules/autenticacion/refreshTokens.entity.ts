import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity()
export class RefreshTokens {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'grant_id' })
  grantId: string;

  @Column()
  iat: Date;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'is_revoked' })
  isRevoked: boolean;

  @Column({ type: 'jsonb' })
  data: Record<string, never>;
}
