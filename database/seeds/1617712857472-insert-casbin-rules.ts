import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertCasbinRules1617712857472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ADMINISTRADOR' , '/usuarios', 'read|update|create|delete', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ADMINISTRADOR' , '/entidades', 'read|update|create|delete', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ADMINISTRADOR' , '/parametros', 'read|update|create', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ENTIDAD' , '/usuarios', 'read', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ENTIDAD' , '/entidades', 'read|update', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ENTIDAD' , '/parametros', 'read', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'USUARIO' , '/usuarios', 'read', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'USUARIO' , '/entidades', 'read', 'frontend')`);
    await queryRunner.query(`INSERT INTO casbin_rule (ptype, v0, v1, v2, v3)
                            VALUES('p', 'ADMINISTRADOR' , '/api/parametros', 'GET', 'backend')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM casbin_rule WHERE ptype='p' AND v0='ADMINISTRADOR' AND v1='/usuarios' AND v2='read' AND v3='frontend'
    `);
    await queryRunner.query(`
      DELETE FROM casbin_rule WHERE ptype='p' AND v0='ADMINISTRADOR' AND v1='/parametros' AND v2='read' AND v3='frontend'
    `);
    await queryRunner.query(`
      DELETE FROM casbin_rule WHERE ptype='p' AND v0='ENTIDAD' AND v1='/parametros' AND v2='read' AND v3='frontend'
    `);
    await queryRunner.query(`
      DELETE FROM casbin_rule WHERE ptype='p' AND v0='ADMINISTRADOR' AND v1='/parametros' AND v2='GET' AND v3='backend'
    `);
  }
}
