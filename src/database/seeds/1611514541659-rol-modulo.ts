import { MigrationInterface, QueryRunner } from 'typeorm';
import * as uuid from 'uuid';
export class rolModulo1611514541659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO rol_modulo (id, id_rol, id_modulo, estado)
                            VALUES('${uuid.v4()}', '526b78e9-2434-4d9d-b10e-c59a37fbde13', 'd561bd91-c406-4dd4-9d3f-fd9c19f5aba2','ACTIVO')`);

    await queryRunner.query(`INSERT INTO rol_modulo (id, id_rol, id_modulo, estado)
                            VALUES('${uuid.v4()}', '526b78e9-2434-4d9d-b10e-c59a37fbde13', 'b9d07e44-97a1-40bd-85be-99ed16b435c9', 'ACTIVO')`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE rol_modulo;`);
  }
}
