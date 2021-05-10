import { TextService } from 'src/common/lib/text.service';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertsParametros1617820337609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // TIPO DOCUMENTO
    const parametros = [
      {
        id: TextService.generateUuid(),
        codigo: 'TD-CI',
        nombre: 'Cédula de identidad',
        grupo: 'TD',
        descripcion: 'Cédula de Identidad',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TD-CIE',
        nombre: 'Cédula de identidad de extranjero',
        grupo: 'TD',
        descripcion: 'Cédula de identidad de extranjero',
      },
      // APPS
      {
        id: TextService.generateUuid(),
        codigo: 'TAPP-B',
        nombre: 'Backend',
        grupo: 'TAPP',
        descripcion: 'Backend',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TAPP-F',
        nombre: 'Frontend',
        grupo: 'TAPP',
        descripcion: 'Frontend',
      },
      // ACCIONES
      // FRONTEND
      {
        id: TextService.generateUuid(),
        codigo: 'TACCF-R',
        nombre: 'read',
        grupo: 'TACCF',
        descripcion: 'READ',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TACCF-U',
        nombre: 'update',
        grupo: 'TACCF',
        descripcion: 'UPDATE',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TACCF-C',
        nombre: 'create',
        grupo: 'TACCF',
        descripcion: 'CREATE',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TACCF-D',
        nombre: 'delete',
        grupo: 'TACCF',
        descripcion: 'DELETE',
      },
      // BACKEND
      {
        id: TextService.generateUuid(),
        codigo: 'TACCB-G',
        nombre: 'GET',
        grupo: 'TACCB',
        descripcion: 'GET',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TACCB-U',
        nombre: 'UPDATE',
        grupo: 'TACCB',
        descripcion: 'UPDATE',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TACCF-P',
        nombre: 'PATCH',
        grupo: 'TACC',
        descripcion: 'PATCH',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TACCB-C',
        nombre: 'POST',
        grupo: 'TACCB',
        descripcion: 'POST',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TACCB-D',
        nombre: 'DELETE',
        grupo: 'TACCB',
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
