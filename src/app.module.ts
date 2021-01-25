import { AppController } from './app.controller';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { Module } from '@nestjs/common';
import { AutenticacionModule } from './modules/autenticacion/autenticacion.module';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './config/database/database.module';
import { ExternalModule } from './external/external.module';
import { EntidadModule } from './modules/entidad/entidad.module';
import { LogsModule } from './config/logger/logger.module';
import { ParametroModule } from './modules/parametro/parametro.module';
import { AutorizacionModule } from './autorizacion/modules/autorizacion/autorizacion.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DataBaseModule,
    LogsModule,
    ExternalModule,
    UsuarioModule,
    AutenticacionModule,
    EntidadModule,
    ParametroModule,
    AutorizacionModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
