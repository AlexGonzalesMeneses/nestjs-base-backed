import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller()
export class AppController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('/status')
  async status(@Res() res: Response) {
    this.logger.log('status()', AppController.name);

    return res.status(HttpStatus.OK).send('Servicio funcionando correctamente');
  }
}
