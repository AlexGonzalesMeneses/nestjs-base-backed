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
    const usuariosRoles = items.map((item) => {
      const usuarioRol = new UsuarioRol({
        idRol: item.rol,
        idUsuario: item.usuario,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: '1',
        fechaCreacion: new Date(),
      })
      return usuarioRol
    })
    await queryRunner.manager.save(usuariosRoles)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
