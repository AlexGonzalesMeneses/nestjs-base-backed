import { MigrationInterface, QueryRunner } from 'typeorm';
import * as uuid from 'uuid';
export class usuarioRol1611516017924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO usuario_rol (id, id_rol, id_usuario, estado)
                            VALUES('${uuid.v4()}', (SELECT id FROM rol WHERE rol = 'ADMINISTRADOR'), (SELECT id FROM usuario WHERE usuario = 'admin'),'ACTIVO')`);
    await queryRunner.query(`INSERT INTO usuario_rol (id, id_rol, id_usuario, estado)
                            VALUES('${uuid.v4()}', (SELECT id FROM rol WHERE rol = 'ENTIDAD'), (SELECT id FROM usuario WHERE usuario = 'admin'),'ACTIVO')`);
    await queryRunner.query(`INSERT INTO usuario_rol (id, id_rol, id_usuario, estado)
                            VALUES('${uuid.v4()}', (SELECT id FROM rol WHERE rol = 'USUARIO'), (SELECT id FROM usuario WHERE usuario = 'admin'),'ACTIVO')`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE usuario_rol;`);
  }
}
