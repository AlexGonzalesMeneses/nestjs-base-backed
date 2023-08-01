import { ArgumentsHost, Catch } from '@nestjs/common'
import { Request, Response } from 'express'
import { BaseException, LoggerService } from '../../../..'

const logger = LoggerService.getInstance()

@Catch()
export class ExceptionFilter {
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

    const except = new BaseException(exception, {
      metadata: {
        req: errorRequest,
      },
    })

    logger.error(except)

    const errorResult = {
      finalizado: false,
      codigo: except.getHttpStatus(),
      timestamp: Math.floor(Date.now() / 1000),
      mensaje: except.obtenerMensajeCliente(),
      datos: {
        causa: except.getCausa(),
        accion: except.getAccion(),
      },
    }

    response.status(errorResult.codigo).json(errorResult)
  }
}
