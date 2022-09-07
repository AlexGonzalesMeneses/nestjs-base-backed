import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { LoggerService } from './core/logger/logger.service'
import { BaseController } from './common/base/base-controller'

@Controller()
export class AppController extends BaseController {
  constructor(
    protected logger: LoggerService,
    @Inject(ConfigService) private configService: ConfigService
  ) {
    super(logger, AppController.name)
  }

  @Get('/estado')
  async verificarEstado(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      estado: 'Servicio funcionando correctamente',
      commit_sha: this.configService.get('CI_COMMIT_SHORT_SHA'),
      mensaje: this.configService.get('CI_COMMIT_MESSAGE'),
      branch: this.configService.get('CI_COMMIT_REF_NAME'),
      hora: Math.floor(Date.now() / 1000),
    })
  }
}
