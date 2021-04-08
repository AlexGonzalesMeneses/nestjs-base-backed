import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthZManagementService } from 'nest-authz';

@Injectable()
export class CasbinGuard implements CanActivate {
  constructor(private readonly rbacSrv: AuthZManagementService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      user,
      originalUrl: resource,
      method: action,
    } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('No autorizado');
    }
    const app = 'backend';
    for (const rol of user.roles) {
      if (await this.rbacSrv.hasPolicy(rol, resource, action, app)) return true;
    }
    return false;
  }
}
