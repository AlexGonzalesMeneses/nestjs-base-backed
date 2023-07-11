import { ArgumentsHost, Catch } from '@nestjs/common'
import { Request, Response } from 'express'
import { BaseExceptionFilter } from '../base/base-exception-filter'
import { ExceptionManager } from '../../common/exception-manager'
import packageJson from '../../../package.json'

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor() {
    super()
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const errorRequest = {
      method: request.method,
      originalUrl: request.originalUrl,
      headers: request.headers,
      params: request.params,
      query: request.query,
      body: request.body,
      user: request.user,
    }

    const errorInfo = ExceptionManager.handleError(
      exception,
      HttpExceptionFilter.name,
      { sistema: `${packageJson.name} v${packageJson.version}` }
    )
    const errorResult = {
      finalizado: false,
      codigo: errorInfo.codigo,
      timestamp: Math.floor(Date.now() / 1000),
      mensaje: errorInfo.obtenerMensajeCliente(),
      datos: {
        causa: errorInfo.causa,
        accion: errorInfo.accion,
      },
    }

    const args = errorInfo.toPrint()
    args.push('\n───── Respuesta ───────')
    args.push(errorResult)
    args.push('\n───── Petición ────────')
    args.push(errorRequest)

    const logLevel = errorInfo.getLogLevel()
    this.logger[logLevel](...args)

    response.status(errorResult.codigo).json(errorResult)
  }
}
