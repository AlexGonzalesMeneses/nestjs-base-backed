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
    const status = exception.getStatus()
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      codigo: status,
      timestamp: new Date().toISOString(),
      mensaje:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message || 'Ocurrio un error...'
          : 'Error Interno',
    };
    // logger
    Logger.error('[error] %j', JSON.stringify(errorResponse));
    response.status(status).json(errorResponse);
  }
}
