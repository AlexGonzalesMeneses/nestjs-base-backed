import { MigrationInterface, QueryRunner } from 'typeorm';

export class usuario1611171041789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO persona(id, nombres, primer_apellido, segundo_apellido, tipo_documento, nro_documento, fecha_nacimiento, genero, estado)
                        VALUES('512554fe-4684-4ba9-8bf9-35eced771947', 'Administrador', 'Sistema', '', 'CI', '4206898', '2002-02-09', 'M','ACTIVO')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM persona WHERE id='512554fe-4684-4ba9-8bf9-35eced771947'`,
    );
  }
}
