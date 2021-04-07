import {MigrationInterface, QueryRunner} from "typeorm";

export class reglaPoliticas1617819635554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ADMINISTRADOR' , '/politicas', 'create', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ADMINISTRADOR' , '/politicas', 'read', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ADMINISTRADOR' , '/politicas', 'update', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ADMINISTRADOR' , '/politicas', 'delete', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ADMINISTRADOR' , '/api/autorizacion/politicas', 'GET', 'backend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ADMINISTRADOR' , '/api/autorizacion/politicas', 'POST', 'backend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ADMINISTRADOR' , '/api/autorizacion/politicas/eliminar', 'POST', 'backend')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM casbin_rule WHERE ptype='p' AND v0='ADMINISTRADOR' AND v1='/politicas' AND v2='read' AND v3='frontend'
    `);
    await queryRunner.query(`
      DELETE FROM casbin_rule WHERE ptype='p' AND v0='ADMINISTRADOR' AND v1='/politicas' AND v2='create' AND v3='frontend'
    `);
    await queryRunner.query(`
      DELETE FROM casbin_rule WHERE ptype='p' AND v0='ADMINISTRADOR' AND v1='/politicas' AND v2='update' AND v3='frontend'
    `);
    await queryRunner.query(`
      DELETE FROM casbin_rule WHERE ptype='p' AND v0='ADMINISTRADOR' AND v1='/politicas' AND v2='delete' AND v3='frontend'
    `);
    await queryRunner.query(`
      DELETE FROM casbin_rule WHERE ptype='p' AND v0='ADMINISTRADOR' AND v1='/api/autorizacion/politicas' AND v2='GET' AND v3='backend'
    `);
    await queryRunner.query(`
      DELETE FROM casbin_rule WHERE ptype='p' AND v0='ADMINISTRADOR' AND v1='/api/autorizacion/politicas' AND v2='POST' AND v3='backend'
    `);
    await queryRunner.query(`
      DELETE FROM casbin_rule WHERE ptype='p' AND v0='ADMINISTRADOR' AND v1='/api/autorizacion/politicas/eliminar' AND v2='POST' AND v3='backend'
    `);
  }
}
