import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common'
import { Response } from 'express'
import { PinoLogger } from 'nestjs-pino'
import { Messages } from '../constants/response-messages'

class HttpExceptionFilterError extends Error {
  constructor(original: Error) {
    super(original.message)
    this.stack = original.stack
  }
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HttpExceptionFilter.name)
  }

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const esErrorInterno = status === HttpStatus.INTERNAL_SERVER_ERROR

    if (esErrorInterno) {
      const error = new HttpExceptionFilterError(exception)
      this.logger.error({ error }, '[Http Exception Filter]')
    }

    let errores: Array<string> = []

    if (exception instanceof HttpException) {
      const r: any = exception.getResponse()
      const msg = r instanceof Error ? r.toString() : r.message ? r.message : r

      if (Array.isArray(msg)) {
        msg.map((item) => errores.push(item))
      } else if (typeof msg === 'object') {
        errores.push(msg)
      } else if (typeof msg === 'string') {
        errores.push(msg)
      }
    }

    if (process.env.NODE_ENV === 'production') {
      errores = []
    }

    const mensaje = this.isBusinessException(exception)
    const errorResponse = {
      finalizado: false,
      codigo: status,
      timestamp: Math.floor(Date.now() / 1000),
      mensaje,
      datos: {
        errores,
      },
    }
    response.status(status).json(errorResponse)
  }

  public isBusinessException(exception: HttpException | Error): string {
    return this.filterMessage(exception)
  }

  filterMessage(exception: HttpException | Error): string {
    const message: string = exception.message
    if (message) return message

    switch (exception.constructor) {
      case BadRequestException:
        return Messages.EXCEPTION_BAD_REQUEST
      case UnauthorizedException:
        return Messages.EXCEPTION_UNAUTHORIZED
      case NotFoundException:
        return Messages.EXCEPTION_NOT_FOUND
      case PreconditionFailedException:
        return Messages.EXCEPTION_PRECONDITION_FAILED
      case ForbiddenException:
        return Messages.EXCEPTION_FORBIDDEN
      default:
        return Messages.EXCEPTION_INTERNAL_SERVER_ERROR
    }
  }
}
