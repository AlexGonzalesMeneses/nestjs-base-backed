import { Body, Controller, Inject, Post } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthZRBACService } from 'nest-authz';

@Controller('autorizacion')
export class AuthorizationController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly rbacSrv: AuthZRBACService,
  ) {}

  @Post('/politica')
  async crearPolitica(@Body() politica) {
    this.logger.log('aaa', AuthorizationController.name);
    const { sujeto, objeto, accion } = politica;
    await this.rbacSrv.addPermissionForUser(sujeto, objeto, accion);
    return {
      mensaje: 'Politica creada con exito',
    };
  }
}
