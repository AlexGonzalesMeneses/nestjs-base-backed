import { TextService } from 'src/common/lib/text.service';
import { PropiedadesDto } from 'src/core/authorization/dto/crear-modulo.dto';
import { Modulo } from 'src/core/authorization/entity/modulo.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class modulo1611497480901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nombre: 'configuracion',
        url: '/configuracion',
        label: 'Configuracion',
        icono: 'settings',
        propiedades: {
          color_light: '#3F1929',
          color_dark: '#AE6DAB',
        },
      },
      {
        nombre: 'usuarios',
        url: '/usuarios',
        label: 'Usuarios',
        icono: 'manage_accounts',
        propiedades: {
          color_light: '#3F1929',
          color_dark: '#AE6DAB',
        },
      },
      {
        nombre: 'entidades',
        url: '/entidades',
        label: 'Entidades',
        icono: 'business',
        propiedades: {
          color_light: '#BDA5AD',
          color_dark: '#BDA5AD',
        },
      },
      {
        nombre: 'parametros',
        url: '/parametros',
        label: 'Parametros',
        icono: 'tune',
        propiedades: {
          color_light: '#312403',
          color_dark: '#B77346',
        },
      },
      {
        nombre: 'politicas',
        url: '/politicas',
        label: 'Politicas',
        icono: 'verified_user',
        propiedades: {
          color_light: '#B4AA99',
          color_dark: '#B4AA99',
        },
      },
    ];
    const modulos = items.map((item) => {
      const m = new Modulo();
      m.id = TextService.textToUuid(item.nombre);
      m.nombre = item.nombre;
      m.url = item.url;
      m.label = item.label;

      const propiedades = new PropiedadesDto();
      propiedades.color_dark = item.propiedades.color_dark;
      propiedades.color_light = item.propiedades.color_light;
      propiedades.icono = item.icono;

      m.propiedades = propiedades;
      return m;
    });
    await queryRunner.manager.save(modulos);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
