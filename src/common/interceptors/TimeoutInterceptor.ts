import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import { LoggerService } from '../../core/logger'
import { Request } from 'express'

const logger = LoggerService.getInstance()
const tiempoMaximoEspera = 5 // Tiempo máximo de espera en segundos

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { originalUrl, method } = context
      .switchToHttp()
      .getRequest() as Request

    return next.handle().pipe(
      timeout(tiempoMaximoEspera * 1000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          const url = originalUrl.split('?')[0]
          logger.error(
            `${method} ${url} tardó demasiado en responder (tiempo transcurrido: ${tiempoMaximoEspera} seg)`
          )
          return throwError(() => new RequestTimeoutException())
        }
        return throwError(() => err)
      })
    )
  }
}
