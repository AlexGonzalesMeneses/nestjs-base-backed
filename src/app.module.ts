import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AutenticacionModule } from './modules/autenticacion/autenticacion.module';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './config/database/database.module';
import { ExternalModule } from './external/external.module';
import { EntidadModule } from './modules/entidad/entidad.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    DataBaseModule,
    ExternalModule,
    UsuarioModule,
    AutenticacionModule,
    LoggerModule.forRoot({
      pinoHttp:
        process.env.NODE_ENV === 'production'
          ? {
              timestamp: () =>
                `,"time":"${new Date(Date.now()).toISOString()}"`,
            }
          : {
              prettyPrint: {
                colorize: true,
                levelFirst: true,
                translateTime: true,
              },
            },
    }),
    EntidadModule,
    DataBaseModule,
    UsuarioModule,
    AutenticacionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
