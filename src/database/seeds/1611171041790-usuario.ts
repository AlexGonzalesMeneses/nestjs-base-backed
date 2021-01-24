import { MigrationInterface, QueryRunner } from 'typeorm';
import { createHash } from 'crypto';

export class usuario1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const pass = createHash('sha256').update('123').digest('hex');
    await queryRunner.query(`INSERT INTO usuario (id, usuario, contrasena, estado) 
                             VALUES('e375afbe-5bac-465a-a29a-3e86fdd74291', 'admin', '${pass}', 'ACTIVO')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM public.usuario WHERE id=1`);
  }
}
