import { Column, Entity, PrimaryColumn } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
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
