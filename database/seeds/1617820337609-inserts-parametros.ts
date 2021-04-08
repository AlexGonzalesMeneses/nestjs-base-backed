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
      // APPS
      {
        id: 3,
        codigo: 'TAPP-B',
        nombre: 'Backend',
        grupo: 'TAPP',
        descripcion: 'Backend',
      },
      {
        id: 4,
        codigo: 'TAPP-F',
        nombre: 'Frontend',
        grupo: 'TAPP',
        descripcion: 'Frontend',
      },
      // ACCIONES
      {
        id: 5,
        codigo: 'TACC-R',
        nombre: 'read',
        grupo: 'TACC',
        descripcion: 'READ',
      },
      {
        id: 6,
        codigo: 'TACC-U',
        nombre: 'update',
        grupo: 'TACC',
        descripcion: 'UPDATE',
      },
      {
        id: 7,
        codigo: 'TACC-C',
        nombre: 'create',
        grupo: 'TACC',
        descripcion: 'CREATE',
      },
      {
        id: 8,
        codigo: 'TACC-D',
        nombre: 'delete',
        grupo: 'TACC',
        descripcion: 'DELETE',
      },
    ];
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('parametro')
      .values(parametros)
      .execute();
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
