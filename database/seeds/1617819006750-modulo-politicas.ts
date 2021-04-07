import {MigrationInterface, QueryRunner} from "typeorm";
import * as uuid from 'uuid';
export class moduloPoliticas1617819006750 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      let uidModule = uuid.v4();
      await queryRunner.query(`INSERT INTO modulo (id, nombre, url, label, icono, estado)
                                VALUES('${uidModule}', 'politicas','/politicas', 'politicas', 'mdiServerSecurity', 'ACTIVO')`);
      await queryRunner.query(`INSERT INTO rol_modulo (id, id_rol, id_modulo, estado)
                               VALUES('${uuid.v4()}', '526b78e9-2434-4d9d-b10e-c59a37fbde13', '${uidModule}', 'ACTIVO')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(``);
    }

}
