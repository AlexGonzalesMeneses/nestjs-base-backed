import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Entidad } from '../../modules/entidad/entidad.entity';
import { Parametro } from '../../modules/parametro/parametro.entity';
import { Usuario } from '../../modules/usuario/usuario.entity';
import { Rol } from '../../modules/autorizacion/entity/rol.entity';
import { Modulo } from 'src/modules/autorizacion/entity/modulo.entity';
import { UsuarioRol } from 'src/modules/autorizacion/entity/usuario-rol.entity';
import { RolModulo } from 'src/modules/autorizacion/entity/rol-modulo.entity';
import { Persona } from 'src/modules/persona/persona.entity';
import { Session } from 'src/modules/autenticacion/session.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        // entities: [
        //   `${__dirname}/../modulos[><]*.entity.${
        //     __dirname.includes('src') ? 'ts' : 'js'
        //   }`,
        // ],
        entities: [
          Entidad,
          Parametro,
          Usuario,
          Rol,
          Modulo,
          UsuarioRol,
          RolModulo,
          Persona,
          Session,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DataBaseModule {}
