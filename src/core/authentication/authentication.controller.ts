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
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { Issuer } from 'openid-client';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { OidcAuthGuard } from './guards/oidc-auth.guard';
import { AuthenticationService } from './authentication.service';
import { RefreshTokensService } from './refreshTokens.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller()
export class AuthenticationController {
  constructor(
    private readonly autenticacionService: AuthenticationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req, @Res() res: Response) {
    // return this.autenticacionService.autenticar(req.user);
    const ttl = parseInt(
      this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      10,
    );
    const result = await this.autenticacionService.autenticar(req.user);
    this.logger.info(`Usuario: ${result.data.id} ingreso al sistema`);
    res.status(200).cookie('jid', result.refresh_token.id, {
      httpOnly: true,
      // secure: true
      // domain: '.app.com',
      // www.example.com
      // api.example.com
      // expires: new Date(Date.now() + ttl),
      // maxAge: ttl,
      // path: '/token',
    });
    return res.send({ finalizado: true, mensaje: 'ok', datos: result.data });
  }

  @Post('token')
  async getAccessToken(@Request() req, @Res() res: Response) {
    const jid = req.cookies['jid'];
    const result = await this.refreshTokensService.createAccessToken(jid);
    console.log(' result: ', result);
    if (result.refresh_token) {
      res.status(200).cookie('jid', result.refresh_token.id, {
        httpOnly: true,
      });
      return res.send({ finalizado: true, mensaje: 'ok', datos: result.data });
    } else {
      return res
        .status(200)
        .json({ finalizado: true, mensaje: 'ok', datos: result.data });
    }
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
      const token = await this.autenticacionService.autenticarOidc(req.user);
      res
        .status(200)
        .cookie('base.token', token, {
          expires: dayjs.unix(req.user.exp).toDate(),
          // httpOnly: true,
        })
        .redirect(`${process.env.URL_FRONTEND}/#/login`);
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
    this.logger.info(`Usuario: ${idUsuario} salio del sistema`);

    // TODO: probar con ciudadania para ver si hace el logout correctamente
    if (url && idToken) {
      res.redirect(
        url +
          '?post_logout_redirect_uri=' +
          process.env.OIDC_POST_LOGOUT_REDIRECT_URI +
          '&id_token_hint=' +
          idToken,
      );
    } else {
      return res.status(200).json();
      // return res.redirect(`${process.env.URL_FRONTEND}/#`);
    }
  }
}
