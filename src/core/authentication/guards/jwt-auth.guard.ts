import { BaseException, LoggerService } from '../../logger'
import {
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  protected logger = LoggerService.getInstance()

  async canActivate(context: ExecutionContext) {
    const {
      originalUrl,
      query,
      route,
      headers,
      method: action,
    } = context.switchToHttp().getRequest() as Request
    const resource = Object.keys(query).length ? route.path : originalUrl

    if (!headers.authorization) {
      throw new BaseException(null, {
        httpStatus: HttpStatus.FORBIDDEN,
        causa: 'Valor "headers.authorization" no definido',
        accion: 'Agregar el token de acceso en el header de la petición',
        metadata: {
          msg: `${action} ${resource} -> false - Token inválido (req.headers.authorization)`,
        },
      })
    }

    try {
      const isPermitted = (await super.canActivate(context)) as boolean
      if (!isPermitted) throw new ForbiddenException()
    } catch (err) {
      const token = headers.authorization
        ? `${headers.authorization.substring(0, 20)}...`
        : String(headers.authorization)

      throw new BaseException(err, {
        accion: 'Verificar que el token sea el correcto',
        metadata: {
          msg: `${action} ${resource} -> false - Token inválido (${token})`,
        },
      })
    }

    const { user } = context.switchToHttp().getRequest()
    this.logger.info(
      `${action} ${resource} -> true - JWT (usuario: ${user?.id})`
    )
    return true
  }
}
