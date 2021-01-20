import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioModule } from '../usuario/usuario.module';
import { AutenticacionController } from './autenticacion.controller';
import { AutenticacionService } from './autenticacion.service';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtConstants } from './constants';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    UsuarioModule,
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService, LocalStrategy],
  exports: [AutenticacionService],
})
export class AutenticacionModule {}
