import { TextService } from 'src/common/lib/text.service';
import { Modulo } from 'src/core/authorization/entity/modulo.entity';
import { RolModulo } from 'src/core/authorization/entity/rol-modulo.entity';
import { Rol } from 'src/core/authorization/entity/rol.entity';
import { RolEnum } from 'src/core/authorization/rol.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class rolModulo1611514541659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: TextService.textToUuid(RolEnum.ADMINISTRADOR),
        modulo: TextService.textToUuid('usuarios'),
      },
      {
        rol: TextService.textToUuid(RolEnum.ADMINISTRADOR),
        modulo: TextService.textToUuid('entidades'),
      },
      {
        rol: TextService.textToUuid(RolEnum.ADMINISTRADOR),
        modulo: TextService.textToUuid('parametros'),
      },
      {
        rol: TextService.textToUuid(RolEnum.TECNICO),
        modulo: TextService.textToUuid('usuarios'),
      },
      {
        rol: TextService.textToUuid(RolEnum.TECNICO),
        modulo: TextService.textToUuid('entidades'),
      },
      {
        rol: TextService.textToUuid(RolEnum.TECNICO),
        modulo: TextService.textToUuid('parametros'),
      },
      {
        rol: TextService.textToUuid(RolEnum.USUARIO),
        modulo: TextService.textToUuid('usuarios'),
      },
      {
        rol: TextService.textToUuid(RolEnum.USUARIO),
        modulo: TextService.textToUuid('entidades'),
      },
      {
        rol: TextService.textToUuid(RolEnum.ADMINISTRADOR),
        modulo: TextService.textToUuid('politicas'),
      },
    ];
    const rolesModulos = items.map((item) => {
      const m = new Modulo();
      m.id = item.modulo;

      const r = new Rol();
      r.id = item.rol;

      const rm = new RolModulo();
      rm.id = TextService.generateUuid();
      rm.rol = r;
      rm.modulo = m;
      return rm;
    });
    await queryRunner.manager.save(rolesModulos);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
