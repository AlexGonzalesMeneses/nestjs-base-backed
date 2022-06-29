import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SessionEntity } from 'typeorm-store';

@Entity()
export class Session extends BaseEntity implements SessionEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'integer' })
  expiresAt: number;

  @Column({ type: 'varchar' })
  data: string;
}
