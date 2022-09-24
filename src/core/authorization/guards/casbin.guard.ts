import { LoggerService } from './../../logger/logger.service'
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common'
import { AUTHZ_ENFORCER } from 'nest-authz'

@Injectable()
export class CasbinGuard implements CanActivate {
  protected logger = LoggerService.getInstance(CasbinGuard.name)

  constructor(@Inject(AUTHZ_ENFORCER) private enforcer: any) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      user,
      originalUrl,
      query,
      route,
      method: action,
    } = context.switchToHttp().getRequest()
    const resource = Object.keys(query).length ? route.path : originalUrl

    if (!user) {
      this.logger.error(
        `${action} ${resource} -> ${false} (Usuario desconocido)`
      )
      throw new ForbiddenException()
    }

    for (const rol of user.roles) {
      const isPermitted = await this.enforcer.enforce(rol, resource, action)
      if (isPermitted) {
        this.logger.info(`${rol} -> ${action} ${resource} -> ${isPermitted}`)
        return true
      }
    }

    this.logger.error(
      `${user.roles.toString()} ${action} ${resource} -> ${false}`
    )
    throw new ForbiddenException()
  }
}
