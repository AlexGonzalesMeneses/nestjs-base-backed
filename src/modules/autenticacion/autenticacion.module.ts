import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsuarioModule } from '../usuario/usuario.module';
import { AutenticacionController } from './autenticacion.controller';
import { AutenticacionService } from './autenticacion.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { buildOpenIdClient, OidcStrategy } from './strategies/oidc.strategy';
import { SessionSerializer } from './session.serializer';

const OidcStrategyFactory = {
  provide: 'OidcStrategy',
  useFactory: async (autenticacionService: AutenticacionService) => {
    const client = await buildOpenIdClient();
    const strategy = new OidcStrategy(autenticacionService, client);
    return strategy;
  },
  inject: [AutenticacionService],
};

@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'oidc' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
    UsuarioModule,
    ConfigModule,
  ],
  controllers: [AutenticacionController],
  providers: [
    AutenticacionService,
    LocalStrategy,
    JwtStrategy,
    OidcStrategyFactory,
    SessionSerializer,
  ],
  exports: [AutenticacionService],
})
export class AutenticacionModule {}
