import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import { Request } from 'express'

import dotenv from 'dotenv'

dotenv.config()

const DEFAULT_REQUEST_TIMEOUT_IN_SECONDS = '30'

const tiempoMaximoEspera = Number(
  process.env.REQUEST_TIMEOUT_IN_SECONDS || DEFAULT_REQUEST_TIMEOUT_IN_SECONDS
)

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { originalUrl } = context.switchToHttp().getRequest() as Request

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
          const mensaje = `La solicitud está demorando demasiado (tiempo transcurrido: ${tiempoMaximoEspera} seg)`
          return throwError(() => new RequestTimeoutException(mensaje))
        }
        return throwError(() => err)
      })
    )
  }
}
