import { MigrationInterface, QueryRunner } from 'typeorm';
import { createHash } from 'crypto';
import * as uuid from 'uuid';

export class usuario1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const pass = createHash('sha256').update('123').digest('hex');
    await queryRunner.query(`INSERT INTO usuario (id, usuario, contrasena, estado) 
                             VALUES('${uuid.v4()}', 'admin', '${pass}', 'ACTIVO')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM public.usuario WHERE id=1`);
  }
}
