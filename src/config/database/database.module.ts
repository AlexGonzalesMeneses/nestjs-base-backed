import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Entidad } from '../../modules/entidad/entidad.entity';
import { Parametro } from '../../modules/parametro/parametro.entity';
import { Usuario } from '../../modules/usuario/usuario.entity';
import { Rol } from '../../modules/autorizacion/entities/rol.entity';
import { Modulo } from 'src/modules/autorizacion/entities/modulo.entity';

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
        entities: [Entidad, Parametro, Usuario, Rol, Modulo],
        synchronize: true,
      }),
    }),
  ],
})
export class DataBaseModule {}
