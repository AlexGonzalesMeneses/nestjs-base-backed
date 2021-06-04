import {
  Controller,
  Delete,
  Param,
  UseGuards,
  Post,
  Request,
  Res,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Logger } from 'nestjs-pino';

import { CookieService } from '../../../common/lib/cookie.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { OidcAuthGuard } from '../guards/oidc-auth.guard';
import { RefreshTokensService } from '../service/refreshTokens.service';

@Controller()
export class RefreshTokensController {
  constructor(
    private readonly refreshTokensService: RefreshTokensService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  @Post('token')
  async getAccessToken(@Request() req, @Res() res: Response) {
    this.logger.log('[getAccessToken] init...');
    const jid = req.cookies['jid'];
    const result = await this.refreshTokensService.createAccessToken(jid);
    this.logger.log('[getAccessToken] result: ');

    if (result.refresh_token) {
      // sendRefreshToken(res, result.refresh_token.id);
      const refreshToken = result.refresh_token.id;
      res.cookie(
        this.configService.get('REFRESH_TOKEN_NAME'),
        refreshToken,
        CookieService.makeConfig(this.configService),
      );
    }
    return res
      .status(200)
      .json({ finalizado: true, mensaje: 'ok', datos: result.data });
  }

  @UseGuards(LocalAuthGuard)
  @UseGuards(OidcAuthGuard)
  @Delete(':id')
  async eliminarRefreshToken(@Param('id') id: string) {
    //
    return this.refreshTokensService.removeByid(id);
  }
}
