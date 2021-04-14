import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const codigoRespuesta = context.switchToHttp().getResponse().statusCode;
    if (codigoRespuesta !== 200) {
      return next.handle().pipe();
    }
    return next.handle().pipe(
      map((data) => ({
        finalizado: data.finalizado || true,
        mensaje: data.mensaje || 'ok',
        datos: data.datos || data,
      })),
    );
  }
}
