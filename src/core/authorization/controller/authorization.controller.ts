import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import { AuthZManagementService } from 'nest-authz';
import { totalRowsResponse } from '../../../common/lib/http.module';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';

@Controller('autorizacion')
export class AuthorizationController extends AbstractController {
  constructor(
    private readonly logger: Logger,
    private readonly rbacSrv: AuthZManagementService,
  ) {
    super();
  }

  @Post('/politicas')
  async crearPolitica(@Body() politica) {
    const { sujeto, objeto, accion, app } = politica;
    await this.rbacSrv.addPolicy(sujeto, objeto, accion, app);
    return this.successCreate(politica);
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
    return this.successList(totalRowsResponse([resultado, resultado.length]));
  }

  @Delete('/politicas')
  @HttpCode(204)
  async eliminarPolitica(@Query() query) {
    const { sujeto, objeto, accion, app } = query;
    await this.rbacSrv.removePolicy(sujeto, objeto, accion, app);
    return this.successDelete(query);
  }

  @Get('/politicas/roles')
  async obtenerRoles() {
    const result = await this.rbacSrv.getPolicy();
    return this.successList(result);
  }
}
