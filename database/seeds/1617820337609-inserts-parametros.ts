import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertsParametros1617820337609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // TIPO DOCUMENTO
    const parametros = [
      {
        id: 1,
        codigo: 'TD-CI',
        nombre: 'Cédula de identidad',
        grupo: 'TD',
        descripcion: 'Cédula de Identidad',
      },
      {
        id: 2,
        codigo: 'TD-CIE',
        nombre: 'Cédula de identidad de extranjero',
        grupo: 'TD',
        descripcion: 'Cédula de identidad de extranjero',
      },
    ];
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('parametro')
      .values(parametros)
      .execute();
    // await queryRunner.manager.insert(Parametro, parametros);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
