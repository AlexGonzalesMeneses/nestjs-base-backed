import { Body, Controller, Inject, Post, Get, Patch, Delete, Param } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthZManagementService } from 'nest-authz';
import { successResponse } from '../../common/lib/http.module';
import { totalRowsResponse } from '../../common/lib/http.module';
import {
  SUCCESS_CREATE,
  SUCCESS_DELETE,
  SUCCESS_LIST,
} from '../../common/constants';

@Controller('autorizacion')
export class AuthorizationController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly rbacSrv: AuthZManagementService,
  ) {}

  @Post('/politica')
  async crearPolitica(@Body() politica) {
    const { sujeto, objeto, accion } = politica;
    return successResponse(
      await this.rbacSrv.addPolicy(sujeto, objeto, accion) ? { sujeto, objeto, accion } : {},
      SUCCESS_CREATE,
    );
  }

  @Get('/politica')
  async listarPolitica() {
    const respuesta = await this.rbacSrv.getPolicy();
    const resultado = [];
    for (const i in respuesta) {
      resultado.push({'sujeto': respuesta[i][0], 'objeto': respuesta[i][1], 'accion': respuesta[i][2]});
    }
    return successResponse(
      totalRowsResponse([resultado, respuesta.length]),
      SUCCESS_LIST,
    );
  }

  @Post('/politica/eliminar')
  async eliminarPolitica(@Body() politica) {
    const { sujeto, objeto, accion } = politica;
    return successResponse(
      await this.rbacSrv.removePolicy(sujeto, objeto, accion) ? { sujeto, objeto, accion } : {},
      SUCCESS_DELETE,
    );
  }
}
