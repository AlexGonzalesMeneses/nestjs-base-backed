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
      throw new BaseException({
        codigo: HttpStatus.UNAUTHORIZED,
        causa: 'Valor "req.user" no definido',
        accion: 'Agregar JWTGuard. Ej.: @UseGuards(JwtAuthGuard, CasbinGuard)',
        detalle: `${action} ${resource} -> false - El usuario no se encuentra autenticado`,
      })
    }

    for (const rol of user.roles) {
      const isPermitted = await this.enforcer.enforce(rol, resource, action)
      if (isPermitted) {
        this.logger.info(
          `${action} ${resource} -> true - CASBIN (rol: ${rol} usuario: ${user.id})`
        )
        return true
      }
    }

    throw new BaseException({
      codigo: HttpStatus.FORBIDDEN,
      causa: `No se encontraron roles válidos que puedan acceder a este recurso`,
      accion: 'Definir la regla CASBIN para consumir el recurso',
      detalle: `${action} ${resource} (${user.roles.toString()}) -> false - Permisos insuficientes (CASBIN)`,
    })
  }
}
