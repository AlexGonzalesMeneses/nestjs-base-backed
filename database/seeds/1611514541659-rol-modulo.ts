import { MigrationInterface, QueryRunner } from 'typeorm';
import * as uuid from 'uuid';
export class rolModulo1611514541659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO rol_modulo (id, id_rol, id_modulo, estado)
                            VALUES('${uuid.v4()}', (SELECT id FROM rol WHERE rol = 'ADMINISTRADOR'), (SELECT id FROM modulo WHERE url='/usuarios'), 'ACTIVO')`);

    await queryRunner.query(`INSERT INTO rol_modulo (id, id_rol, id_modulo, estado)
                            VALUES('${uuid.v4()}', (SELECT id FROM rol WHERE rol = 'ADMINISTRADOR'), (SELECT id FROM modulo WHERE url='/entidades'), 'ACTIVO')`);

    await queryRunner.query(`INSERT INTO rol_modulo (id, id_rol, id_modulo, estado)
                            VALUES('${uuid.v4()}', (SELECT id FROM rol WHERE rol = 'ADMINISTRADOR'), (SELECT id FROM modulo WHERE url='/parametros'), 'ACTIVO')`);


    await queryRunner.query(`INSERT INTO rol_modulo (id, id_rol, id_modulo, estado)
                            VALUES('${uuid.v4()}', (SELECT id FROM rol WHERE rol = 'ENTIDAD'), (SELECT id FROM modulo WHERE url='/usuarios'), 'ACTIVO')`);

    await queryRunner.query(`INSERT INTO rol_modulo (id, id_rol, id_modulo, estado)
                            VALUES('${uuid.v4()}', (SELECT id FROM rol WHERE rol = 'ENTIDAD'), (SELECT id FROM modulo WHERE url='/entidades'), 'ACTIVO')`);

    await queryRunner.query(`INSERT INTO rol_modulo (id, id_rol, id_modulo, estado)
                            VALUES('${uuid.v4()}', (SELECT id FROM rol WHERE rol = 'ENTIDAD'), (SELECT id FROM modulo WHERE url='/parametros'), 'ACTIVO')`);


    await queryRunner.query(`INSERT INTO rol_modulo (id, id_rol, id_modulo, estado)
                            VALUES('${uuid.v4()}', (SELECT id FROM rol WHERE rol = 'USUARIO'), (SELECT id FROM modulo WHERE url='/usuarios'), 'ACTIVO')`);

    await queryRunner.query(`INSERT INTO rol_modulo (id, id_rol, id_modulo, estado)
                            VALUES('${uuid.v4()}', (SELECT id FROM rol WHERE rol = 'USUARIO'), (SELECT id FROM modulo WHERE url='/entidades'), 'ACTIVO')`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE rol_modulo;`);
  }
}
