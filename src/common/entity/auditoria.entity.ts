import { BaseEntity, Column } from 'typeorm'

export abstract class AuditoriaEntity extends BaseEntity {
  // @Check(`_estado in ('${Status.ACTIVE}', '${Status.INACTIVE}')`)
  // @Column({
  //   name: '_estado',
  //   length: 30,
  //   type: 'varchar',
  //   default: Status.ACTIVE,
  // })
  _estado: string

  @Column('character varying', {
    name: '_transaccion',
    length: 30,
    nullable: false,
  })
  _transaccion: string

  @Column('bigint', { name: '_usuario_creacion', nullable: true })
  _usuarioCreacion: string

  @Column('timestamp without time zone', {
    name: '_fecha_creacion',
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
