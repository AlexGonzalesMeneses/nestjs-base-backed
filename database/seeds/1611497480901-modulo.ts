import { TextService } from 'src/common/lib/text.service';
import { PropiedadesDto } from 'src/core/authorization/dto/crear-modulo.dto';
import { Modulo } from 'src/core/authorization/entity/modulo.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class modulo1611497480901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      // MENU SESSION PRINCIPAL
      {
        nombre: 'Principal',
        url: '/principal',
        label: 'Principal',
        propiedades: {
          icono: 'home',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
        },
      },
      {
        nombre: 'inicio',
        url: '/admin/home',
        label: 'Inicio',
        propiedades: {
          icono: 'home',
          descripcion: 'Vista de bienvenida con características del sistema',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
        },
        fidModulo: TextService.textToUuid('Principal'),
      },
      {
        nombre: 'perfil',
        url: '/admin/perfil',
        label: 'Perfil',
        propiedades: {
          icono: 'person',
          descripcion: 'Información del perfil de usuario que inicio sesión',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
        },
        fidModulo: TextService.textToUuid('Principal'),
      },
      // MENU SECCION CONFIGURACIONES
      {
        nombre: 'configuraciones',
        url: '/configuraciones',
        label: 'Configuración',
        propiedades: {
          icono: 'settings',
          color_light: '#3F1929',
          color_dark: '#AE6DAB',
        },
      },
      {
        nombre: 'usuarios',
        url: '/admin/usuarios',
        label: 'Usuarios',
        propiedades: {
          icono: 'manage_accounts',
          descripcion: 'Control de usuarios del sistema',
          color_light: '#3F1929',
          color_dark: '#AE6DAB',
        },
        fidModulo: TextService.textToUuid('configuraciones'),
      },
      {
        nombre: 'parametros',
        url: '/admin/parametros',
        label: 'Parámetros',
        propiedades: {
          icono: 'tune',
          descripcion: 'Parametros generales del sistema',
          color_light: '#312403',
          color_dark: '#B77346',
        },
        fidModulo: TextService.textToUuid('configuraciones'),
      },
      {
        nombre: 'politicas',
        url: '/admin/politicas',
        label: 'Politicas',
        propiedades: {
          icono: 'verified_user',
          descripcion: 'Control de permisos para los usuarios',
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
      propiedades.icono = item.propiedades.icono;
      propiedades.descripcion = item.propiedades.descripcion

      m.propiedades = propiedades;
      return m;
    });
    await queryRunner.manager.save(modulos);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
