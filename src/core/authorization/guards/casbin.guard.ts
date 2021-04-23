import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { AUTHZ_ENFORCER } from 'nest-authz';
@Injectable()
export class CasbinGuard implements CanActivate {
  constructor(@Inject(AUTHZ_ENFORCER) private enforcer) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      user,
      originalUrl: resource,
      method: action,
    } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException();
    }
    for (const rol of user.roles) {
      if (await this.enforcer.enforce(rol, resource, action)) return true;
    }
    return false;
  }
}
