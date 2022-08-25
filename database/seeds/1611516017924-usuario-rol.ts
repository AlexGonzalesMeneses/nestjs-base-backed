import { UsuarioRol } from '../../src/core/authorization/entity/usuario-rol.entity'
import { Usuario } from '../../src/core/usuario/entity/usuario.entity'
import { Rol } from '../../src/core/authorization/entity/rol.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class usuarioRol1611516017924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: '1',
        rol: '1', //TextService.textToUuid(RolEnum.ADMINISTRADOR),
        usuario: '1', //TextService.textToUuid('ADMINISTRADOR'),
      },
      {
        id: '2',
        rol: '1', // TextService.textToUuid(RolEnum.ADMINISTRADOR),
        usuario: '2', // TextService.textToUuid('ADMINISTRADOR-TECNICO'),
      },
      {
        id: '3',
        rol: '2', // TextService.textToUuid(RolEnum.TECNICO),
        usuario: '2', // TextService.textToUuid('ADMINISTRADOR-TECNICO'),
      },
      {
        id: '4',
        rol: '2', //TextService.textToUuid(RolEnum.TECNICO),
        usuario: '3', // TextService.textToUuid('TECNICO'),
      },
    ]
    const usuarioRol = items.map((item) => {
      const r = new Rol()
      r.id = item.rol

      const u = new Usuario()
      u.id = item.usuario

      const ur = new UsuarioRol()
      ur.id = item.id
      ur._usuarioCreacion = '1'
      ur.rol = r
      ur.usuario = u
      ur._transaccion = 'SEEDS'
      return ur
    })
    await queryRunner.manager.save(usuarioRol)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
