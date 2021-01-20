import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

import { Logger } from 'nestjs-pino';

@Controller()
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Get('/status')
  status(@Res() res: Response) {
    this.logger.debug('status()', AppController.name);
    return res.status(HttpStatus.OK).send('Servicio funcionando correctamente');
  }
}
