import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AutenticacionModule } from './modules/autenticacion/autenticacion.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    LoggerModule.forRoot({
     pinoHttp: process.env.NODE_ENV === 'production' ? {timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`} : {
       prettyPrint: {
         colorize: true,
         levelFirst: true,
         translateTime: true
       }
     }
    }),
    UsuarioModule, 
    AutenticacionModule, 
    TypeOrmModule.forRoot(typeOrmConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}