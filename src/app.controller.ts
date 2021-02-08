import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller()
export class AppController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('/estado')
  async verificarEstado(@Res() res: Response) {
    this.logger.log('estado()', AppController.name);

    return res.status(HttpStatus.OK).json({
      mensaje: 'Servicio funcionando correctamente',
      hora: Math.floor(Date.now() / 1000),
    });
  }
}
