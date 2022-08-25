import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import dotenv from 'dotenv'
dotenv.config()

@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class RefreshTokens {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ name: 'grant_id' })
  grantId: string

  @Column({ type: 'timestamp without time zone' })
  iat: Date

  @Column({ name: 'expires_at', type: 'timestamp without time zone' })
  expiresAt: Date

  @Column({ name: 'is_revoked', type: 'boolean' })
  isRevoked: boolean

  @Column({ type: 'jsonb' })
  data: unknown
}
