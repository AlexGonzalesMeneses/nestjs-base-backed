import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './modulos/usuario/usuario.module';
import { AutenticacionModule } from './modulos/autenticacion/autenticacion.module';

@Module({
  imports: [UsuarioModule, AutenticacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
