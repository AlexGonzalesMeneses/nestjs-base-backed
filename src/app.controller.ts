import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseController } from './common/base/base-controller'
import packageJson from '../package.json'
import dayjs from 'dayjs'
import { LOG_LEVEL, LoggerService } from './core/logger'

@Controller()
export class AppController extends BaseController {
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    super()
  }

  @Get('/estado')
  async verificarEstado() {
    const now = dayjs()
    return {
      servicio: packageJson.name,
      version: packageJson.version,
      entorno: this.configService.get('NODE_ENV'),
      estado: 'Servicio funcionando correctamente',
      commit_sha: this.configService.get('CI_COMMIT_SHORT_SHA'),
      mensaje: this.configService.get('CI_COMMIT_MESSAGE'),
      branch: this.configService.get('CI_COMMIT_REF_NAME'),
      fecha: now.format('YYYY-MM-DD HH:mm:ss.SSS'),
      hora: now.valueOf(),
    }
  }

  @Get('/log-level')
  async estadoNivelActual() {
    return LoggerService.getLevelStatus()
  }

  @Patch('/log-level')
  async cambiarNivel(
    @Body() body: { level?: string; audit?: string; secret: string }
  ) {
    if (!body.secret || body.secret !== process.env.LOG_SECRET) {
      throw new UnauthorizedException()
    }
    const level = body.level
    if (typeof level !== 'undefined' && LOG_LEVEL[level.toUpperCase()]) {
      LoggerService.changeLevel(level as LOG_LEVEL)
    }
    const audit = body.audit
    if (typeof audit !== 'undefined') {
      LoggerService.changeAudit(audit)
    }
    return LoggerService.getLevelStatus()
  }
}
