import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractEntity {
  // datos de auditoria
  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
  fechaCreacion: Date;

  @Column({ name: 'usuario_creacion', type: 'varchar' })
  usuarioCreacion: string;

  @UpdateDateColumn({
    name: 'fecha_actualizacion',
    nullable: true,
    type: 'timestamptz',
  })
  fechaActualizacion: Date | null;

  @Column({ name: 'usuario_actualizacion', type: 'varchar', nullable: true })
  usuarioActualizacion: string | null;
}
