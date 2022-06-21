import {
  Controller,
  Get,
  Inject,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Issuer } from 'openid-client';
import { CookieService } from '../../../common/lib/cookie.service';

import { LocalAuthGuard } from '../guards/local-auth.guard';
import { OidcAuthGuard } from '../guards/oidc-auth.guard';
import { AuthenticationService } from '../service/authentication.service';
import { RefreshTokensService } from '../service/refreshTokens.service';
import { PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AuthenticationController {
  static staticLogger: PinoLogger;

  // eslint-disable-next-line max-params
  constructor(
    private readonly autenticacionService: AuthenticationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly logger: PinoLogger,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.logger.setContext(AuthenticationController.name);
    AuthenticationController.staticLogger = this.logger;
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req, @Res() res: Response) {
    const result = await this.autenticacionService.autenticar(req.user);
    this.logger.info(`Usuario: ${result.data.id} ingreso al sistema`);
    /* sendRefreshToken(res, result.refresh_token.id); */
    const refreshToken = result.refresh_token.id;
    return res
      .cookie(
        this.configService.get('REFRESH_TOKEN_NAME'),
        refreshToken,
        CookieService.makeConfig(this.configService),
      )
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: result.data });
  }

  @UseGuards(OidcAuthGuard)
  @Get('ciudadania-auth')
  async loginCiudadania() {
    //
  }

  @UseGuards(OidcAuthGuard)
  @Get('ciudadania-callback')
  async loginCiudadaniaCallback(@Request() req, @Res() res: Response) {
    if (req.user) {
      const result = await this.autenticacionService.autenticarOidc(req.user);
      // sendRefreshToken(res, result.refresh_token.id);
      const refreshToken = result.refresh_token.id;
      res
        .cookie(
          this.configService.get('REFRESH_TOKEN_NAME'),
          refreshToken,
          CookieService.makeConfig(this.configService),
        )
        .status(200)
        .redirect(
          `${this.configService.get('URL_FRONTEND')}/#/login?code=${
            result.data.access_token
          }`,
        );
    } else {
      res.redirect(this.configService.get('URL_FRONTEND'));
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logoutCiudadania(@Request() req: Request | any, @Res() res: Response) {
    const jid = req.cookies.jid || '';
    if (jid != '') {
      this.refreshTokensService.removeByid(jid);
    }
    const idToken =
      req?.user?.idToken || req?.session?.passport?.user?.idToken || null;

    // req.logout();
    req.session = null;
    const issuer = await Issuer.discover(this.configService.get('OIDC_ISSUER'));
    const url = issuer.metadata.end_session_endpoint;
    res.clearCookie('connect.sid');
    res.clearCookie('jid', jid);
    const idUsuario = JSON.parse(
      Buffer.from(req.headers.authorization.split('.')[1], 'base64').toString(),
    ).id;
    this.logger.info(`Usuario: ${idUsuario} salio del sistema`);

    if (url && idToken) {
      return res.status(200).json({
        url: `${url}?post_logout_redirect_uri=${this.configService.get(
          'OIDC_POST_LOGOUT_REDIRECT_URI',
        )}&id_token_hint=${idToken}`,
      });
    } else {
      return res.status(200).json();
    }
  }
}
