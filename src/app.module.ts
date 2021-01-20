import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './modulos/usuario/usuario.module';
import { AutenticacionModule } from './modulos/autenticacion/autenticacion.module';

import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './config/database/database.module';
import { ExternalModule } from './external/external.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    DataBaseModule,
    ExternalModule,
    UsuarioModule,
    AutenticacionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
