import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'

const tiempoMaximoEspera = 2 // en segundos

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(tiempoMaximoEspera * 1000),
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
