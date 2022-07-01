import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity()
export class RefreshTokens {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'grant_id' })
  grantId: string;

  @Column({ type: 'timestamp' })
  iat: Date;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'is_revoked', type: 'boolean' })
  isRevoked: boolean;

  @Column({ type: 'jsonb' })
  data: Record<string, never>;
}
