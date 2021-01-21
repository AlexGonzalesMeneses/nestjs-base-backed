import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class usuario1611173577609 implements MigrationInterface {
  name = 'usuario1611173577609';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuario',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'usuario',
            type: 'character varying(50)',
          },
          {
            name: 'contrasena',
            type: 'character varying(255)',
          },
          {
            name: 'estado',
            type: 'enum',
            enum: ['ACTIVO', 'INACTIVO'],
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usuario"`);
  }
}
