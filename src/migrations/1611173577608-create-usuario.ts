import { MigrationInterface, QueryRunner } from 'typeorm';

export class usuario1611173577608 implements MigrationInterface {
  name = 'usuario1611173577608';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "usuario_estado_enum" AS ENUM('ACTIVO', 'INACTIVO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "usuario" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "usuario" character varying(50) NOT NULL, "contrasena" character varying(255) NOT NULL, "estado" "usuario_estado_enum" NOT NULL DEFAULT 'ACTIVO', CONSTRAINT "UQ_9921cd8ed63a072b8f93ead80f0" UNIQUE ("usuario"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usuario"`);
    await queryRunner.query(`DROP TYPE "usuario_estado_enum"`);
  }
}
