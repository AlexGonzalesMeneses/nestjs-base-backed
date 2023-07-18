import { ArgumentsHost, Catch } from '@nestjs/common'
import { Request, Response } from 'express'
import { BaseExceptionFilter } from '../base/base-exception-filter'

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

    const errorInfo = this.logger.error(exception, {
      request: errorRequest,
    })

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

    response.status(errorResult.codigo).json(errorResult)
  }
}
