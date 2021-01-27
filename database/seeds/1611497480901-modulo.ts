import { MigrationInterface, QueryRunner } from 'typeorm';
export class modulo1611497480901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO modulo (id, nombre, url, label, icono, estado)
                              VALUES('b9d07e44-97a1-40bd-85be-99ed16b435c9', 'configuracion','/configuracion', 'configuracion', 'settings', 'ACTIVO')`);
    await queryRunner.query(`INSERT INTO modulo (id, nombre, url, label, icono, estado)
                            VALUES('d561bd91-c406-4dd4-9d3f-fd9c19f5aba2', 'usuarios','/usuarios', 'usuarios', 'person', 'ACTIVO')`);
    await queryRunner.query(`INSERT INTO modulo (id, nombre, url, label, icono, estado)
                            VALUES('d561bd91-c406-4dd4-9d3f-fd9c19f5aba3', 'entidades','/entidades', 'entidades', 'business', 'ACTIVO')`);
    await queryRunner.query(`INSERT INTO modulo (id, nombre, url, label, icono, estado)
                            VALUES('d561bd91-c406-4dd4-9d3f-fd9c19f5aba4', 'parametros','/parametros', 'parametros', 'setup', 'ACTIVO')`);                            
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE modulo;`);
  }
}
