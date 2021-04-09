import { TextService } from 'src/common/lib/text.service';
import { Modulo } from 'src/core/authorization/entity/modulo.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class modulo1611497480901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nombre: 'configuracion',
        url: '/configuracion',
        label: 'Configuracion',
        icono: 'mdiCogOutline',
      },
      {
        nombre: 'usuarios',
        url: '/usuarios',
        label: 'Usuarios',
        icono: 'mdiAccountCog',
      },
      {
        nombre: 'entidades',
        url: '/entidades',
        label: 'Entidades',
        icono: 'mdiDomain',
      },
      {
        nombre: 'parametros',
        url: '/parametros',
        label: 'Parametros',
        icono: 'mdiFileTree',
      },
      {
        nombre: 'politicas',
        url: '/politicas',
        label: 'Politicas',
        icono: 'mdiServerSecurity',
      },
    ];
    const modulos = items.map((item) => {
      const m = new Modulo();
      m.id = TextService.textToUuid(item.nombre);
      m.nombre = item.nombre;
      m.url = item.url;
      m.label = item.label;
      m.icono = item.icono;
      return m;
    });
    await queryRunner.manager.save(modulos);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
