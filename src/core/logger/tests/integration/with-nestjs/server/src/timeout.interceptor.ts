import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import { LoggerService } from '../../../../../../logger'
import { Request } from 'express'

const logger = LoggerService.getInstance()
const DEFAULT_REQUEST_TIMEOUT = '5' // en segundos
const tiempoMaximoEspera = Number(DEFAULT_REQUEST_TIMEOUT)

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
          const mensaje = `${method} ${url} tardó demasiado en responder (tiempo transcurrido: ${tiempoMaximoEspera} seg)`
          logger.error(err, mensaje)
          return throwError(() => new RequestTimeoutException())
        }
        return throwError(() => err)
      })
    )
  }
}
