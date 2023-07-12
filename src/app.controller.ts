import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseController } from './common/base/base-controller'
import { ExceptionManager } from './common/exception-manager'
import packageJson from '../package.json'
import dayjs from 'dayjs'
import { LogRequestDTO } from './app.dto'
import { Response } from 'express'

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
      entorno: process.env.NODE_ENV,
      estado: 'Servicio funcionando correctamente',
      commit_sha: this.configService.get('CI_COMMIT_SHORT_SHA'),
      mensaje: this.configService.get('CI_COMMIT_MESSAGE'),
      branch: this.configService.get('CI_COMMIT_REF_NAME'),
      fecha: now.format('YYYY-MM-DD HH:mm:ss.SSS'),
      hora: now.valueOf(),
    }
  }

  @Post('/log')
  async registrarLog(@Res() res: Response, @Body() body: LogRequestDTO) {
    try {
      const codigoHttp = body.codigo || 500
      if (codigoHttp >= 400) {
        const errorInfo = ExceptionManager.handleError('', AppController.name, {
          codigo: codigoHttp,
          mensaje: body.mensaje,
          detalle: [
            {
              fecha: body.fecha,
              navegador: body.navegador,
            },
            body.detalle,
          ],
          sistema: body.sistema,
          causa: body.causa,
          origen: body.origen,
          accion: body.accion,
        })
        errorInfo.save(this.logger)
      } else {
        this.logger.trace(body)
      }

      return res.status(204).send()
    } catch (err) {
      //
    }
  }
}
