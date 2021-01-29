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
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AutenticacionService } from './autenticacion.service';
import { OidcAuthGuard } from './guards/oidc-auth.guard';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as dayjs from 'dayjs';

@Controller()
export class AutenticacionController {
  constructor(
    private readonly autenticacionService: AutenticacionService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req) {
    // console.log(req.user);
    this.logger.info(JSON.stringify(req.user));
    // this.logger.error(req.user);
    return this.autenticacionService.autenticar(req.user);
  }

  @UseGuards(OidcAuthGuard)
  @Get('ciudadania-auth')
  async loginCiudadania() {
    //
  }

  @UseGuards(OidcAuthGuard)
  @Get('ciudadania-callback')
  async loginCiudadaniaCallback(@Request() req, @Res() res: Response) {
    const token = await this.autenticacionService.autenticarOidc(req.user);

    res
      .status(200)
      .cookie('base.token', token, {
        expires: dayjs.unix(req.user.exp).toDate(),
        httpOnly: true,
      })
      .redirect(`${process.env.URL_FRONTEND}/#/login`);
  }
}
