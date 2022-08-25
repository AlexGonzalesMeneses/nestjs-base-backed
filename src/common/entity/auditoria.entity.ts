import { BaseEntity, Column } from 'typeorm'

export abstract class AuditoriaEntity extends BaseEntity {
  @Column({
    name: '_estado',
    length: 30,
    type: 'varchar',
    nullable: false,
  })
  _estado: string

  @Column('varchar', {
    name: '_transaccion',
    length: 30,
    nullable: false,
  })
  _transaccion: string

  @Column('bigint', {
    name: '_usuario_creacion',
    nullable: false,
  })
  _usuarioCreacion: string

  @Column('timestamp without time zone', {
    name: '_fecha_creacion',
    nullable: false,
    default: () => 'now()',
  })
  _fechaCreacion: Date

  @Column('bigint', {
    name: '_usuario_modificacion',
    nullable: true,
  })
  _usuarioModificacion: string | null

  @Column('timestamp without time zone', {
    name: '_fecha_modificacion',
    nullable: true,
  })
  _fechaModificacion: Date | null
}
