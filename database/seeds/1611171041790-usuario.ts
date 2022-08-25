import { Usuario } from '../../src/core/usuario/entity/usuario.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { TextService } from '../../src/common/lib/text.service'
import { Status, TipoDocumento } from '../../src/common/constants'
import dayjs from 'dayjs'
import { Persona } from '../../src/core/usuario/entity/persona.entity'

export class usuario1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const DEFAULT_PASS = '123'
    const pass = await TextService.encrypt(DEFAULT_PASS)
    const items = [
      {
        //id: 1,
        usuario: 'ADMINISTRADOR',
        //persona: 1, //TextService.textToUuid('9270815'),
        correoElectonico: 'agepic-9270815@yopmail.com',
        persona: {
          nombres: 'JUAN',
          primerApellido: 'PEREZ',
          segundoApellido: 'PEREZ',
          tipoDocumento: TipoDocumento.CI,
          nroDocumento: '9270815',
          fechaNacimiento: dayjs('2002-02-09', 'YYYY-MM-DD').toDate(),
          genero: 'M',
          _transaccion: 'SEEDS',
        },
      },
      {
        //id: 2,
        usuario: 'ADMINISTRADOR-TECNICO',
        //persona: 2, // TextService.textToUuid('1765251'),
        correoElectonico: 'agepic-1765251@yopmail.com',
        persona: {
          id: '2',
          nombres: 'MARIA',
          primerApellido: 'PEREZ',
          segundoApellido: 'PEREZ',
          tipoDocumento: TipoDocumento.CI,
          nroDocumento: '1765251',
          fechaNacimiento: dayjs('2002-02-10', 'YYYY-MM-DD').toDate(),
          genero: 'F',
          _transaccion: 'SEEDS',
        },
      },
      {
        //id: 3,
        usuario: 'TECNICO',
        //persona: 3, // TextService.textToUuid('6114767'),
        correoElectonico: 'agepic-6114767@yopmail.com',
        persona: {
          //id: 3,
          nombres: 'PEDRO',
          primerApellido: 'PEREZ',
          segundoApellido: 'PEREZ',
          tipoDocumento: TipoDocumento.CI,
          nroDocumento: '6114767',
          fechaNacimiento: dayjs('2002-02-11', 'YYYY-MM-DD').toDate(),
          genero: 'M',
          _transaccion: 'SEEDS',
        },
      },
    ]

    const usuarios = items.map((item) => {
      let p = JSON.parse(JSON.stringify(item.persona)) as Persona
      //p.id = item.persona;
      //p.nroDocumento = '617824533';
      //p = item.persona;
      const u = new Usuario()
      //u.id = item.id; //  TextService.textToUuid(item.usuario);
      u.usuario = item.usuario
      u.correoElectronico = item.correoElectonico
      u.contrasena = pass
      u._fechaCreacion = new Date()
      u._estado = Status.ACTIVE
      u._usuarioCreacion = '1'
      u._transaccion = 'SEEDS'
      u.persona = p
      return u
    })

    await queryRunner.manager.save(usuarios)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
