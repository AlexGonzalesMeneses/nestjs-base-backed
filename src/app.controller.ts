import { Controller, Get, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseController } from './common/base/base-controller'
import packageJson from '../package.json'
import dayjs from 'dayjs'

@Controller()
export class AppController extends BaseController {
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    super()
  }

  @Get('/estado')
  async verificarEstado() {
    // await new Promise((resolve) => setTimeout(() => resolve(1), 10000))
    throw new Error('BOOM')
    const now = dayjs()
    return {
      servicio: packageJson.name,
      version: packageJson.version,
      entorno: process.env.NODE_ENV,
      estado: 'Servicio funcionando correctamente',
      commit_sha: this.configService.get('CI_COMMIT_SHORT_SHA'),
      mensaje: this.configService.get('CI_COMMIT_MESSAGE'),
      branch: this.configService.get('CI_COMMIT_REF_NAME'),
      fecha: now.format('YYYY-MM-DD HH:mm:ss.SSS'),
      hora: now.valueOf(),
    }
  }
}
