import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AutenticacionModule } from './modules/autenticacion/autenticacion.module';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './config/database/database.module';
import { ExternalModule } from './external/external.module';
import { EntidadModule } from './modules/entidad/entidad.module';
import { LogsModule } from './config/logger/logger.module';
import { ParametroModule } from './modules/parametro/parametro.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    DataBaseModule,
    ExternalModule,
    UsuarioModule,
    AutenticacionModule,
    EntidadModule,
    LogsModule,
    DataBaseModule,
    UsuarioModule,
    AutenticacionModule,
    EntidadModule,
    ParametroModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
