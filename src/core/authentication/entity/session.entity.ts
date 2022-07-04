import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SessionEntity } from 'typeorm-store';
import dotenv from 'dotenv';
dotenv.config();


@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class Session extends BaseEntity implements SessionEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'integer' })
  expiresAt: number;

  @Column({ type: 'varchar' })
  data: string;
}
