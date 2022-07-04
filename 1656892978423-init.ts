import { MigrationInterface, QueryRunner } from "typeorm";

export class init1656892978423 implements MigrationInterface {
    name = 'init1656892978423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."parametro_estado_enum" AS ENUM('ACTIVO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "parametro" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo" character varying(15) NOT NULL, "nombre" character varying(50) NOT NULL, "grupo" character varying(15) NOT NULL, "descripcion" character varying(255) NOT NULL, "estado" "public"."parametro_estado_enum" NOT NULL DEFAULT 'ACTIVO', CONSTRAINT "UQ_98aa6d5f03731ea33310ac2a293" UNIQUE ("codigo"), CONSTRAINT "PK_68501c6508f3b3874238d49fe41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" character varying NOT NULL, "expiresAt" integer NOT NULL, "data" character varying NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" character varying NOT NULL, "grant_id" character varying NOT NULL, "iat" TIMESTAMP WITH TIME ZONE NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "is_revoked" boolean NOT NULL, "data" jsonb NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "casbin_rule" ("id" SERIAL NOT NULL, "ptype" character varying, "v0" character varying, "v1" character varying, "v2" character varying, "v3" character varying, "v4" character varying, "v5" character varying, "v6" character varying, CONSTRAINT "PK_e147354d31e2748a3a5da5e3060" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."persona_tipo_documento_enum" AS ENUM('CI', 'PASAPORTE', 'OTRO')`);
        await queryRunner.query(`CREATE TYPE "public"."persona_genero_enum" AS ENUM('M', 'F', 'OTRO')`);
        await queryRunner.query(`CREATE TYPE "public"."persona_estado_enum" AS ENUM('ACTIVO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "persona" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombres" character varying(100), "primer_apellido" character varying(100), "segundo_apellido" character varying(100), "tipo_documento" "public"."persona_tipo_documento_enum" NOT NULL DEFAULT 'CI', "tipo_documento_otro" character varying(50), "nro_documento" character varying(50) NOT NULL, "fecha_nacimiento" date, "telefono" character varying(50), "genero" "public"."persona_genero_enum", "observacion" character varying(255), "estado" "public"."persona_estado_enum" NOT NULL DEFAULT 'ACTIVO', CONSTRAINT "PK_13aefc75f60510f2be4cd243d71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuario_estado_enum" AS ENUM('CREADO', 'PENDIENTE', 'ACTIVO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "usuario" ("fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "usuario_creacion" character varying NOT NULL, "fecha_actualizacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), "usuario_actualizacion" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "usuario" character varying(50) NOT NULL, "contrasena" character varying(255) NOT NULL, "ciudadania_digital" boolean NOT NULL DEFAULT false, "correo_electronico" character varying, "estado" "public"."usuario_estado_enum" NOT NULL DEFAULT 'CREADO', "intentos" integer NOT NULL DEFAULT '0', "codigo_desbloqueo" character varying(100), "fecha_bloqueo" TIMESTAMP WITH TIME ZONE, "id_persona" uuid NOT NULL, CONSTRAINT "UQ_9921cd8ed63a072b8f93ead80f0" UNIQUE ("usuario"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuario_rol_estado_enum" AS ENUM('ACTIVO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "usuario_rol" ("fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "usuario_creacion" character varying NOT NULL, "fecha_actualizacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), "usuario_actualizacion" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "estado" "public"."usuario_rol_estado_enum" NOT NULL DEFAULT 'ACTIVO', "id_rol" uuid, "id_usuario" uuid, CONSTRAINT "PK_6c336b0a51b5c4d22614cb02533" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."rol_estado_enum" AS ENUM('ACTIVO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "rol" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rol" character varying(50) NOT NULL, "nombre" character varying(100) NOT NULL, "estado" "public"."rol_estado_enum" NOT NULL DEFAULT 'ACTIVO', CONSTRAINT "UQ_f75f91537c43db80c3ca8ef34f8" UNIQUE ("rol"), CONSTRAINT "PK_c93a22388638fac311781c7f2dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."modulo_estado_enum" AS ENUM('ACTIVO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "modulo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying(50) NOT NULL, "url" character varying(50) NOT NULL, "nombre" character varying(50) NOT NULL, "propiedades" jsonb NOT NULL, "estado" "public"."modulo_estado_enum" NOT NULL DEFAULT 'ACTIVO', "fid_modulo" uuid, CONSTRAINT "UQ_6c068d8d2b0bc70952bb10f4e6d" UNIQUE ("label"), CONSTRAINT "UQ_299bb322ac097db0129fb1b7755" UNIQUE ("url"), CONSTRAINT "UQ_0a319e8eddaaa2b5e295dc778c6" UNIQUE ("nombre"), CONSTRAINT "PK_0b577bb28fdb8c35383e2c573ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD CONSTRAINT "FK_1fbc7de91b8e96937ed27739e8f" FOREIGN KEY ("id_persona") REFERENCES "persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuario_rol" ADD CONSTRAINT "FK_96d2a6ecb2ad0931416610845cf" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuario_rol" ADD CONSTRAINT "FK_6adca3617fc69b2864e67196f2a" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "modulo" ADD CONSTRAINT "FK_6b742a34c19bc348c2bedf04ac0" FOREIGN KEY ("fid_modulo") REFERENCES "modulo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "modulo" DROP CONSTRAINT "FK_6b742a34c19bc348c2bedf04ac0"`);
        await queryRunner.query(`ALTER TABLE "usuario_rol" DROP CONSTRAINT "FK_6adca3617fc69b2864e67196f2a"`);
        await queryRunner.query(`ALTER TABLE "usuario_rol" DROP CONSTRAINT "FK_96d2a6ecb2ad0931416610845cf"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP CONSTRAINT "FK_1fbc7de91b8e96937ed27739e8f"`);
        await queryRunner.query(`DROP TABLE "modulo"`);
        await queryRunner.query(`DROP TYPE "public"."modulo_estado_enum"`);
        await queryRunner.query(`DROP TABLE "rol"`);
        await queryRunner.query(`DROP TYPE "public"."rol_estado_enum"`);
        await queryRunner.query(`DROP TABLE "usuario_rol"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_rol_estado_enum"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_estado_enum"`);
        await queryRunner.query(`DROP TABLE "persona"`);
        await queryRunner.query(`DROP TYPE "public"."persona_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."persona_genero_enum"`);
        await queryRunner.query(`DROP TYPE "public"."persona_tipo_documento_enum"`);
        await queryRunner.query(`DROP TABLE "casbin_rule"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "parametro"`);
        await queryRunner.query(`DROP TYPE "public"."parametro_estado_enum"`);
    }

}
