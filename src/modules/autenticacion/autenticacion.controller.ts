import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AutenticacionService } from './autenticacion.service';
import { OidcAuthGuard } from './guards/oidc-auth.guard';
import * as dayjs from 'dayjs';
import { Issuer } from 'openid-client';

@Controller()
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req, @Res() res: Response) {
    const result = await this.autenticacionService.autenticar(req.user);
    res.status(200).cookie('jid', result.refreshToken.id, {
      httpOnly: true,
      // domain: '.example.com'
      // www.example.com
      // api.example.com
      // path: "/refresh_token"
    });
    return res.send({ finalizado: true, mensaje: 'ok', datos: result.data });
  }

  @Post('token')
  async getAccessToken(@Request() req) {
    // const refreshToken = req.refreshToken
    console.log(' ******************** req.body: ', req.body);
    return {};
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
    const idToken = req.user ? req.user.idToken : null;
    req.logout();
    req.session.destroy(async (error: any) => {
      const issuer = await Issuer.discover(process.env.OIDC_ISSUER);
      const url = issuer.metadata.end_session_endpoint;
      if (url && idToken) {
        res.redirect(
          url +
            '?post_logout_redirect_uri=' +
            process.env.OIDC_POST_LOGOUT_REDIRECT_URI +
            '&id_token_hint=' +
            idToken,
        );
      } else {
        res.redirect(`${process.env.URL_FRONTEND}/#/logout`);
      }
    });
  }
}
