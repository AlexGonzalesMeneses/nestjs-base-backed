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
import { Response } from 'express';
import { Logger } from 'nestjs-pino';

import { sendRefreshToken } from '../../../common/lib/http.module';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { OidcAuthGuard } from '../guards/oidc-auth.guard';
import { RefreshTokensService } from '../service/refreshTokens.service';

@Controller('refreshtoken')
export class RefreshTokensController {
  constructor(
    private readonly refreshTokensService: RefreshTokensService,
    private readonly logger: Logger,
  ) {}

  @Post('token')
  async getAccessToken(@Request() req, @Res() res: Response) {
    this.logger.log('[getAccessToken] init...');
    const jid = req.cookies['jid'];
    const result = await this.refreshTokensService.createAccessToken(jid);
    this.logger.log('[getAccessToken] result: ');

    if (result.refresh_token) {
      sendRefreshToken(res, result.refresh_token.id);
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
