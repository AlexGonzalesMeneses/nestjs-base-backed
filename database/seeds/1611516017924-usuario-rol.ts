import { MigrationInterface, QueryRunner } from 'typeorm';
import * as uuid from 'uuid';
export class usuarioRol1611516017924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO usuario_rol (id, id_rol, id_usuario, estado)
                            VALUES('${uuid.v4()}', '526b78e9-2434-4d9d-b10e-c59a37fbde13', 'e375afbe-5bac-465a-a29a-3e86fdd74291','ACTIVO')`);
    await queryRunner.query(`INSERT INTO usuario_rol (id, id_rol, id_usuario, estado)
                            VALUES('${uuid.v4()}', '94abbf94-5cdd-4f52-ae5c-b8001a48a568', 'e375afbe-5bac-465a-a29a-3e86fdd74291','ACTIVO')`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE usuario_rol;`);
  }
}
