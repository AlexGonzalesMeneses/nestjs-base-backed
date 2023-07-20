import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { BaseController } from './common/base/base-controller'
import packageJson from '../package.json'
import dayjs from 'dayjs'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller()
@ApiTags('Estado')
export class AppController extends BaseController {
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el estado de la aplicación' })
  @Get('/estado')
  async verificarEstado(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      servicio: packageJson.name,
      version: packageJson.version,
      entorno: process.env.NODE_ENV,
      estado: 'Servicio funcionando correctamente',
      commit_sha: this.configService.get('CI_COMMIT_SHORT_SHA'),
      mensaje: this.configService.get('CI_COMMIT_MESSAGE'),
      branch: this.configService.get('CI_COMMIT_REF_NAME'),
      fecha: dayjs().format('DD/MM/YYYY HH:mm:ss'),
      hora: Math.floor(Date.now() / 1000),
    })
  }
}
