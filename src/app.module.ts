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
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AutorizacionModule } from './modules/autorizacion/autorizacion.module';
import { ReporteModule } from './modules/reporte/reporte.module';
import { WinstonLoggerModule } from './config/logger/winston-logger.module';
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
    ReporteModule,
    WinstonLoggerModule,
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
