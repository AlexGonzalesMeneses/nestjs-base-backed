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
import { Request, Response } from 'express'
import { LoggerService } from './../../core/logger/logger.service'
import { Messages } from '../constants/response-messages'
import { AxiosError } from 'axios'

type ObjectOrError = {
  statusCode?: number
  message?: string | string[] | object | object[]
  error?: string
}

class HttpExceptionFilterError extends Error {
  codigo: number
  mensaje: string
  errores: (string | object)[]

  constructor(original: unknown) {
    super()
    if (original instanceof HttpException) {
      this.codigo = original.getStatus()
      this.mensaje = HttpExceptionFilterError.getMessage(original)
      this.errores = HttpExceptionFilterError.getErrors(original)
      this.stack = original.stack
    } else if (original instanceof AxiosError) {
      this.codigo = HttpStatus.INTERNAL_SERVER_ERROR
      this.mensaje = Messages.EXCEPTION_INTERNAL_SERVER_ERROR
      this.errores = [{ axiosError: original }]
      this.stack = original.stack
    } else if (original instanceof Error) {
      this.codigo = HttpStatus.INTERNAL_SERVER_ERROR
      this.mensaje = Messages.EXCEPTION_INTERNAL_SERVER_ERROR
      this.errores = [original.toString()]
      this.stack = original.stack
    } else {
      this.codigo = HttpStatus.INTERNAL_SERVER_ERROR
      this.mensaje = Messages.EXCEPTION_INTERNAL_SERVER_ERROR
      this.errores = [String(original)]
    }
  }

  static getMessage(exception: HttpException): string {
    const response = exception.getResponse() as ObjectOrError
    if (typeof response === 'string') {
      return response
    }

    if (response.message && response.error) {
      if (typeof response.message === 'string') {
        return response.message
      }
      if (
        Array.isArray(response.message) &&
        response.message.length > 0 &&
        typeof response.message[0] === 'string'
      ) {
        return response.message[0]
      }
    }

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

  static getErrors(exception: HttpException): (string | object)[] {
    const response = exception.getResponse() as ObjectOrError
    if (!response.statusCode || !response.message) {
      return [response]
    }
    if (Array.isArray(response.message)) {
      if (
        response.message.length === 1 &&
        typeof response.message[0] === 'string'
      ) {
        return []
      }
      return response.message
    }
    return []
  }
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(protected logger: LoggerService) {
    this.logger.setContext(HttpExceptionFilter.name)
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

    const filterError = new HttpExceptionFilterError(exception)
    const errorResponse = {
      finalizado: false,
      codigo: filterError.codigo,
      timestamp: Math.floor(Date.now() / 1000),
      mensaje: filterError.mensaje,
      datos: {
        errores: filterError.errores,
      },
    }

    if (errorResponse.codigo >= 400 && errorResponse.codigo < 500) {
      this.logger.warn({ errorRequest })
      this.logger.warn({ errorResponse })
      if (filterError.stack) {
        this.logger.warn(filterError.stack)
      }
    } else {
      this.logger.error({ errorRequest })
      this.logger.error({ errorResponse })
      if (filterError.stack) {
        this.logger.error(filterError.stack)
      }
    }

    if (process.env.NODE_ENV === 'production') {
      errorResponse.datos.errores = []
    }

    response.status(filterError.codigo).json(errorResponse)
  }
}
