import { Usuario } from 'src/core/usuario/entity/usuario.entity';
import { TextService } from 'src/common/lib/text.service';
import { Rol } from 'src/core/authorization/entity/rol.entity';
import { UsuarioRol } from 'src/core/authorization/entity/usuario-rol.entity';
import { RolEnum } from 'src/core/authorization/rol.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class usuarioRol1611516017924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: TextService.textToUuid(RolEnum.ADMINISTRADOR),
        usuario: TextService.textToUuid('ADMINISTRADOR'),
      },
      {
        rol: TextService.textToUuid(RolEnum.ADMINISTRADOR),
        usuario: TextService.textToUuid('ADMINISTRADOR-TECNICO'),
      },
      {
        rol: TextService.textToUuid(RolEnum.TECNICO),
        usuario: TextService.textToUuid('ADMINISTRADOR-TECNICO'),
      },
      {
        rol: TextService.textToUuid(RolEnum.TECNICO),
        usuario: TextService.textToUuid('TECNICO'),
      },
    ];
    const usuarioRol = items.map((item) => {
      const r = new Rol();
      r.id = item.rol;

      const u = new Usuario();
      u.id = item.usuario;

      const ur = new UsuarioRol();
      ur.id = TextService.generateUuid();
      ur.usuarioCreacion = '1';
      ur.rol = r;
      ur.usuario = u;
      return ur;
    });
    await queryRunner.manager.save(usuarioRol);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
