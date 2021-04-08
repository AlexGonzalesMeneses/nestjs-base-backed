import { MigrationInterface, QueryRunner } from 'typeorm';
export class modulo1611497480901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO modulo (id, nombre, url, label, icono, estado)
                              VALUES('b9d07e44-97a1-40bd-85be-99ed16b435c9', 'configuracion','/configuracion', 'Configuracion', 'mdiCogOutline', 'ACTIVO')`);
    await queryRunner.query(`INSERT INTO modulo (id, nombre, url, label, icono, estado)
                            VALUES('d561bd91-c406-4dd4-9d3f-fd9c19f5aba2', 'usuarios','/usuarios', 'Usuarios', 'mdiAccountCog', 'ACTIVO')`);
    await queryRunner.query(`INSERT INTO modulo (id, nombre, url, label, icono, estado)
                            VALUES('d561bd91-c406-4dd4-9d3f-fd9c19f5aba3', 'entidades','/entidades', 'Entidades', 'mdiDomain', 'ACTIVO')`);
    await queryRunner.query(`INSERT INTO modulo (id, nombre, url, label, icono, estado)
                            VALUES('d561bd91-c406-4dd4-9d3f-fd9c19f5aba4', 'parametros','/parametros', 'Parametros', 'mdiFileTree', 'ACTIVO')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE modulo;`);
  }
}
