import {
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { Issuer } from 'openid-client';
import { sendRefreshToken } from '../../../common/lib/http.module';

import { LocalAuthGuard } from '../guards/local-auth.guard';
import { OidcAuthGuard } from '../guards/oidc-auth.guard';
import { AuthenticationService } from '../service/authentication.service';
import { RefreshTokensService } from '../service/refreshTokens.service';
import { Logger } from 'nestjs-pino';

@Controller()
export class AuthenticationController {
  constructor(
    private readonly autenticacionService: AuthenticationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req, @Res() res: Response) {
    const result = await this.autenticacionService.autenticar(req.user);
    this.logger.log(`Usuario: ${result.data.id} ingreso al sistema`);
    sendRefreshToken(res, result.refresh_token.id);
    return res
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
      sendRefreshToken(res, result.refresh_token.id);
      res
        .status(200)
        .redirect(
          `${process.env.URL_FRONTEND}/#/login?code=${result.data.access_token}`,
        );
    } else {
      res.redirect(`${process.env.URL_FRONTEND}`);
    }
  }

  @Get('logout')
  async logoutCiudadania(@Request() req, @Res() res: Response) {
    const jid = req.cookies.jid || '';
    if (jid != '') {
      this.refreshTokensService.removeByid(jid);
    }
    const idToken = req.user ? req.user.idToken : null;
    // req.logout();
    req.session = null;
    const issuer = await Issuer.discover(process.env.OIDC_ISSUER);
    const url = issuer.metadata.end_session_endpoint;
    res.clearCookie('connect.sid');
    res.clearCookie('jid', jid);
    const idUsuario = JSON.parse(
      Buffer.from(req.headers.authorization.split('.')[1], 'base64').toString(),
    ).id;
    this.logger.log(`Usuario: ${idUsuario} salio del sistema`);

    if (url && idToken) {
      return res.status(200).json({
        url: `${url}?post_logout_redirect_uri=${process.env.OIDC_POST_LOGOUT_REDIRECT_URI}&id_token_hint=${idToken}`,
      });
    } else {
      return res.status(200).json();
    }
  }
}
