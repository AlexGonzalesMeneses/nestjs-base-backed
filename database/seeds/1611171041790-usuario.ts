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
        correoElectonico: 'agepic-9270815@yopmail.com',
      },
      {
        usuario: 'ADMINISTRADOR-TECNICO',
        persona: TextService.textToUuid('1765251'),
        correoElectonico: 'agepic-1765251@yopmail.com',
      },
      {
        usuario: 'TECNICO',
        persona: TextService.textToUuid('6114767'),
        correoElectonico: 'agepic-6114767@yopmail.com',
      },
    ];
    const usuarios = items.map((item) => {
      const p = new Persona();
      p.id = item.persona;
      const u = new Usuario();
      u.id = TextService.textToUuid(item.usuario);
      u.usuario = item.usuario;
      u.correoElectronico = item.correoElectonico;
      u.contrasena = pass;
      u.fechaCreacion = new Date();
      u.estado = 'ACTIVO';
      u.usuarioCreacion = '1';
      u.persona = p;
      return u;
    });
    await queryRunner.manager.save(usuarios);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
