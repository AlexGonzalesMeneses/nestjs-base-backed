import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import dotenv from 'dotenv'
dotenv.config()

@Entity({ schema: process.env.DB_SCHEMA_USUARIOS })
export class CasbinRule extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'Clave primaria de la tabla CasbinRule',
  })
  public id: number

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Tipo de parámetro',
  })
  public ptype: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Se define roles',
  })
  public v0: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Se define rutas',
  })
  public v1: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Se define permisos de CRUD(Create, Read, Update, Delete)',
  })
  public v2: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Se define proyecto (Backend, Frontend)',
  })
  public v3: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Variables de control',
  })
  public v4: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Variables de control',
  })
  public v5: string | null

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Variables de control',
  })
  public v6: string | null

  constructor(data?: Partial<CasbinRule>) {
    super()
    if (data) Object.assign(this, data)
  }
}
