import { BaseEntity, Column } from 'typeorm'

export abstract class AuditoriaEntity extends BaseEntity {
  @Column({
    name: '_estado',
    length: 30,
    type: 'varchar',
    nullable: false,
  })
  estado: string

  @Column('varchar', {
    name: '_transaccion',
    length: 30,
    nullable: false,
  })
  transaccion: string

  @Column('bigint', {
    name: '_usuario_creacion',
    nullable: false,
  })
  usuarioCreacion: string

  @Column('timestamp without time zone', {
    name: '_fecha_creacion',
    nullable: false,
    default: () => 'now()',
  })
  fechaCreacion: Date

  @Column('bigint', {
    name: '_usuario_modificacion',
    nullable: true,
  })
  usuarioModificacion?: string | null

  @Column('timestamp without time zone', {
    name: '_fecha_modificacion',
    nullable: true,
  })
  fechaModificacion?: Date | null

  constructor(data?: Partial<AuditoriaEntity>) {
    super()
    if (data) Object.assign(this, data)
  }
}
