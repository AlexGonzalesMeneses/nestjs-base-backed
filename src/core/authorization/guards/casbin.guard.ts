import { BaseException, LoggerService } from '../../logger'
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common'
import { AUTHZ_ENFORCER } from 'nest-authz'
import { Request } from 'express'
import { Enforcer } from 'casbin/lib/cjs/enforcer'

@Injectable()
export class CasbinGuard implements CanActivate {
  protected logger = LoggerService.getInstance()

  constructor(@Inject(AUTHZ_ENFORCER) private enforcer: Enforcer) {}

  async canActivate(context: ExecutionContext) {
    const {
      user,
      originalUrl,
      query,
      route,
      method: action,
    } = context.switchToHttp().getRequest() as Request
    const resource = Object.keys(query).length ? route.path : originalUrl

    if (!user) {
      throw new BaseException(null, {
        httpStatus: HttpStatus.UNAUTHORIZED,
        causa: 'Valor "req.user" no definido',
        accion: 'Agregar JWTGuard. Ej.: @UseGuards(JwtAuthGuard, CasbinGuard)',
        metadata: {
          msg: `${action} ${resource} -> false - El usuario no se encuentra autenticado`,
        },
      })
    }

    const isPermitted = await this.enforcer.enforce(user.rol, resource, action)
    if (isPermitted) {
      this.logger.audit({
        contexto: 'casbin',
        metadata: {
          v0: user.rol,
          v1: action,
          v2: resource,
          usuario: user.id,
        },
      })
      return true
    }

    throw new BaseException(null, {
      httpStatus: HttpStatus.FORBIDDEN,
      causa: `No se encontraron roles válidos que puedan acceder a este recurso`,
      accion: 'Definir la regla CASBIN para consumir el recurso',
      metadata: {
        msg: `${action} ${resource} (${user.roles.toString()}) -> false - Permisos insuficientes (CASBIN)`,
      },
    })
  }
}
