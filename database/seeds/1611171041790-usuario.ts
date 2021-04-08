import { Persona } from 'src/application/persona/persona.entity';
import { Usuario } from 'src/application/usuario/usuario.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { TextService } from '../../src/common/lib/text.service';

export class usuario1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const pass = TextService.encrypt('123');
    const items = [
      {
        usuario: 'ADMINISTRADOR',
        persona: TextService.textToUuid('9270815'),
      },
      {
        usuario: 'ADMINISTRADOR-TECNICO',
        persona: TextService.textToUuid('1765251'),
      },
      {
        usuario: 'TECNICO',
        persona: TextService.textToUuid('6114767'),
      },
    ];
    const usuarios = items.map((item) => {
      const p = new Persona();
      p.id = item.persona;
      const u = new Usuario();
      u.id = TextService.textToUuid(item.usuario);
      u.usuario = item.usuario;
      u.contrasena = pass;
      u.persona = p;
      return u;
    });
    await queryRunner.manager.save(usuarios);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
