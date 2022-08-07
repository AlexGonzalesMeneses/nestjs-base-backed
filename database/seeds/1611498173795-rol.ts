import { RolEnum } from 'src/core/authorization/rol.enum'
import { Rol } from '../../src/core/authorization/entity/rol.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { TextService } from '../../src/common/lib/text.service'

export class rol1611498173795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: RolEnum.ADMINISTRADOR,
        nombre: 'Administrador',
      },
      {
        rol: RolEnum.TECNICO,
        nombre: 'Técnico',
      },
      {
        rol: RolEnum.USUARIO,
        nombre: 'Usuario',
      },
    ]
    const roles = items.map((item) => {
      const r = new Rol()
      r.id = TextService.textToUuid(item.rol)
      r.rol = item.rol
      r.nombre = item.nombre
      return r
    })
    await queryRunner.manager.save(roles)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
