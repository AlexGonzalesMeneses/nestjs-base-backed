import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractEntity {
  // datos de auditoria
  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @Column({ name: 'usuario_creacion' })
  usuarioCreacion: string;

  @UpdateDateColumn({ name: 'fecha_actualizacion', nullable: true })
  fechaActualizacion: Date;

  @Column({ name: 'usuario_actualizacion', nullable: true })
  usuarioActualizacion: string;
}
