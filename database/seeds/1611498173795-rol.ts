import { RolEnum } from 'src/core/authorization/rol.enum';
import { Rol } from '../../src/core/authorization/entity/rol.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { TextService } from '../../src/common/lib/text.service';

export class rol1611498173795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: RolEnum.ADMINISTRADOR,
      },
      {
        rol: RolEnum.TECNICO,
      },
      {
        rol: RolEnum.USUARIO,
      },
    ];
    const roles = items.map((item) => {
      const r = new Rol();
      r.id = TextService.textToUuid(item.rol);
      r.rol = item.rol;
      return r;
    });
    await queryRunner.manager.save(roles);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
