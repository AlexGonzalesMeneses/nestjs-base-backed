import { TextService } from 'src/common/lib/text.service';
import { PropiedadesDto } from 'src/core/authorization/dto/crear-modulo.dto';
import { Modulo } from 'src/core/authorization/entity/modulo.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class modulo1611497480901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
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
        nombre: 'configuraciones',
        url: '/configuraciones',
        label: 'Configuraciones Generales',
        icono: 'settings',
        propiedades: {
          color_light: '#3F1929',
          color_dark: '#AE6DAB',
        },
      },
      {
        nombre: 'parametros',
        url: '/parametros',
        label: 'Parámetros',
        icono: 'tune',
        propiedades: {
          color_light: '#312403',
          color_dark: '#B77346',
        },
        fidModulo: TextService.textToUuid('configuraciones'),
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
        fidModulo: TextService.textToUuid('configuraciones'),
      },
    ];
    const modulos = items.map((item) => {
      const m = new Modulo();
      m.id = TextService.textToUuid(item.nombre);
      m.nombre = item.nombre;
      m.url = item.url;
      m.label = item.label;
      if (item.fidModulo) {
        const submodulo = new Modulo();
        submodulo.id = item.fidModulo;
        m.fidModulo = submodulo;
      }
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
