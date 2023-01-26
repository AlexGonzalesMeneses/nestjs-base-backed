import { LoggerService } from '../../logger/logger.service'
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AUTHZ_ENFORCER } from 'nest-authz'
import { Request } from 'express'

@Injectable()
export class CasbinGuard implements CanActivate {
  protected logger = LoggerService.getInstance(CasbinGuard.name)

  constructor(@Inject(AUTHZ_ENFORCER) private enforcer: any) {}

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
      this.logger.warn(
        `${action} ${resource} -> false - Rol: desconocido (Valor requerido: req.user)`
      )
      throw new UnauthorizedException()
    }

    for (const rol of user.roles) {
      const isPermitted = await this.enforcer.enforce(rol, resource, action)
      if (isPermitted) {
        this.logger.info(
          `${action} ${resource} -> true - Rol: ${rol} (usuario: ${user.id})`
        )
        return true
      }
    }

    const rolesDelToken = user.roles
    this.logger.warn(
      `${action} ${resource} -> false - Rol: desconocido (Roles permitidos: ${rolesDelToken.toString()})`
    )
    throw new ForbiddenException()
  }
}
