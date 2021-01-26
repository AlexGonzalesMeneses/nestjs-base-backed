import { MigrationInterface, QueryRunner } from 'typeorm';

export class rol1611498173795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO rol (id, rol, estado)
                              VALUES('526b78e9-2434-4d9d-b10e-c59a37fbde13', 'admin', 'ACTIVO')`);
    await queryRunner.query(`INSERT INTO rol (id, rol, estado)
                              VALUES('94abbf94-5cdd-4f52-ae5c-b8001a48a568', 'usuario', 'ACTIVO')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE rol;`);
  }
}
