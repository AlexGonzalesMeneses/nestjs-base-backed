/* eslint-disable max-lines-per-function */
import { CasbinRule } from 'src/core/authorization/entity/casbin.entity';
import { RolEnum } from 'src/core/authorization/rol.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertCasbinRules1617712857472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      // FRONTEND
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/usuarios',
        v2: 'read|update|create|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/parametros',
        v2: 'read|update|create',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/politicas',
        v2: 'create|read|update|delete',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/home',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/usuarios',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/parametros',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.USUARIO,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      // BACKEND
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/politicas',
        v2: 'GET|POST|DELETE',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/politicas/:id',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/autorizacion/modulos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/cuenta/ciudadania',
        v2: 'POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id/activacion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id/inactivacion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/usuarios/:id/restauracion',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/api/parametros',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/autorizacion/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/autorizacion/modulos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/usuarios',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO,
        v1: '/api/parametros',
        v2: 'GET|POST',
        v3: 'backend',
      },
      // TODOS
      {
        v0: RolEnum.TODOS,
        v1: '/api/parametros/:grupo/listado',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TODOS,
        v1: '/api/autorizacion/permisos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TODOS,
        v1: '/api/usuarios/cuenta/perfil',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TODOS,
        v1: '/api/cuenta/contrasena',
        v2: 'PATCH',
        v3: 'backend',
      },
    ];
    const casbin = items.map((item) => {
      const c = new CasbinRule();
      c.ptype = 'p';
      c.v0 = item.v0;
      c.v1 = item.v1;
      c.v2 = item.v2;
      c.v3 = item.v3;
      return c;
    });
    await queryRunner.manager.save(casbin);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
