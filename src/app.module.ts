import { AppController } from './app.controller';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { Module } from '@nestjs/common';
import { AutenticacionModule } from './modules/autenticacion/autenticacion.module';
import { ConfigModule } from '@nestjs/config';
import { ExternalModule } from './external/external.module';
import { EntidadModule } from './modules/entidad/entidad.module';
import { ParametroModule } from './modules/parametro/parametro.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AutorizacionModule } from './modules/autorizacion/autorizacion.module';
import { ReporteModule } from './modules/reporte/reporte.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { ConfigCoreModule } from './config/config.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigCoreModule,
    ExternalModule,
    UsuarioModule,
    AutenticacionModule,
    EntidadModule,
    ParametroModule,
    AutorizacionModule,
    ReporteModule,
    AuthorizationModule,
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
