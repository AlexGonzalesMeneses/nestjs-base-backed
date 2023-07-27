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

import dotenv from 'dotenv'
dotenv.config()

const logger = LoggerService.getInstance()

const DEFAULT_REQUEST_TIMEOUT = '30' // en segundos

const tiempoMaximoEspera = Number(
  process.env.REQUEST_TIMEOUT_IN_SECONDS || DEFAULT_REQUEST_TIMEOUT
)

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { originalUrl, method } = context
      .switchToHttp()
      .getRequest() as Request

    const url = originalUrl.split('?')[0]

    const ignorePaths: string[] = [
      // rutas a excluir. Ej: '/api/estado'
    ]

    if (ignorePaths.includes(url)) {
      return next.handle()
    }

    const tiempoEspera = tiempoMaximoEspera * 1000

    return next.handle().pipe(
      timeout(tiempoEspera),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          const mensaje = `${method} ${url} tardó demasiado en responder (tiempo transcurrido: ${tiempoMaximoEspera} seg)`
          logger.error(err, mensaje)
          return throwError(() => new RequestTimeoutException())
        }
        return throwError(() => err)
      })
    )
  }
}
