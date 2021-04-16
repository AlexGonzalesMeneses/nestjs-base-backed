import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus()
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const r = <any>exception.getResponse();
    let errores = {};
    Logger.error('[error] %j', JSON.stringify(r));
    if (Array.isArray(r.message)) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      const validationErrors = r.message;
      errores = validationErrors;
    }
    const errorResponse = {
      codigo: status,
      timestamp: new Date().toISOString(),
      mensaje: this.filterMessage(status) || r.message,
      datos: {
        errores,
      },
    };
    response.status(status).json(errorResponse);
  }
  filterMessage(statusCode) {
    let message;
    switch (statusCode) {
      case 400:
        message = 'Error de validacion';
        break;
      case 401:
        message = 'Usuario no autorizado';
        break;
      case 404:
        message = 'Recurso no encontrado';
        break;
      default:
        message = null;
    }
    return message;
  }
}
