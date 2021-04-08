import { Body, Controller, Inject, Post, Get } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthZManagementService } from 'nest-authz';
import { successResponse } from '../../../common/lib/http.module';
import { totalRowsResponse } from '../../../common/lib/http.module';
import {
  SUCCESS_CREATE,
  SUCCESS_DELETE,
  SUCCESS_LIST,
} from '../../../common/constants';

@Controller('autorizacion')
export class AuthorizationController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly rbacSrv: AuthZManagementService,
  ) {}

  @Post('/politicas')
  async crearPolitica(@Body() politica) {
    const { sujeto, objeto, accion, app } = politica;
    return successResponse(
      (await this.rbacSrv.addPolicy(sujeto, objeto, accion, app))
        ? { sujeto, objeto, accion, app }
        : {},
      SUCCESS_CREATE,
    );
  }

  @Get('/politicas')
  async listarPolitica() {
    const respuesta = await this.rbacSrv.getPolicy();
    const resultado = [];
    for (const i in respuesta) {
      resultado.push({
        sujeto: respuesta[i][0],
        objeto: respuesta[i][1],
        accion: respuesta[i][2],
        app: respuesta[i][3],
      });
    }
    return successResponse(
      totalRowsResponse([resultado, respuesta.length]),
      SUCCESS_LIST,
    );
  }

  @Post('/politicas/eliminar')
  async eliminarPolitica(@Body() politica) {
    const { sujeto, objeto, accion, app } = politica;
    return successResponse(
      (await this.rbacSrv.removePolicy(sujeto, objeto, accion, app))
        ? { sujeto, objeto, accion, app }
        : {},
      SUCCESS_DELETE,
    );
  }

  @Get('/politicas/roles')
  async obtenerRoles() {
    const resultado = await this.rbacSrv.getPolicy();
    return successResponse(resultado, SUCCESS_LIST);
  }
}
