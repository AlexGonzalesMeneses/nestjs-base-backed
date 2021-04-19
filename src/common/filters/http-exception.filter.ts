import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { EntityUnauthorizedException } from '../exceptions/entity-unauthorized.exception';
import { Messages } from '../constants/response-messages';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus()
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const r = <any>exception.getResponse();
    let errores = [];
    console.error('[error] %o', r);
    if (Array.isArray(r.message)) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      const validationErrors = r.message;
      errores = validationErrors;
    }

    const errorResponse = {
      codigo: status,
      timestamp: new Date().toISOString(),
      mensaje: this.isBusinessException(exception),
      datos: {
        errores,
      },
    };
    response.status(status).json(errorResponse);
  }
  public isBusinessException(exception: Error): any {
    if (
      exception instanceof EntityNotFoundException ||
      exception instanceof EntityUnauthorizedException
    ) {
      return exception.message;
    } else {
      const message = this.filterMessage(exception);
      return message;
    }
  }

  filterMessage(exception) {
    let message;
    switch (exception.constructor) {
      case BadRequestException:
        message = Messages.EXCEPTION_BAD_REQUEST;
        break;
      case UnauthorizedException:
        message = Messages.EXCEPTION_UNAUTHORIZED;
        break;
      case NotFoundException:
        message = Messages.EXCEPTION_NOT_FOUND;
        break;
      default:
        message = Messages.EXCEPTION_DEFAULT;
    }
    return message;
  }
}
