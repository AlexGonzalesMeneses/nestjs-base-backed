import { Injectable } from '@nestjs/common';
import { AuthZManagementService } from 'nest-authz';
import { totalRowsResponse } from 'src/common/lib/http.module';

@Injectable()
export class AuthorizationServive {
  constructor(private readonly rbacSrv: AuthZManagementService) {}

  async listarPoliticas() {
    const politicas = await this.rbacSrv.getPolicy();
    const result = politicas.map((politica) => ({
      sujeto: politica[0],
      objeto: politica[1],
      accion: politica[2],
      app: politica[3],
    }));
    return totalRowsResponse([result, result.length]);
  }

  async crearPolitica(politica) {
    const { sujeto, objeto, accion, app } = politica;
    await this.rbacSrv.addPolicy(sujeto, objeto, accion, app);
    return politica;
  }

  async actualizarPolitica(politica, politicaNueva) {
    const { sujeto, objeto, accion, app } = politicaNueva;
    await this.elimininarPolitica(politica);
    await this.rbacSrv.addPolicy(sujeto, objeto, accion, app);
  }

  async elimininarPolitica(politica) {
    const { sujeto, objeto, accion, app } = politica;
    await this.rbacSrv.removePolicy(sujeto, objeto, accion, app);
    return politica;
  }

  async obtenerRoles() {
    const result = await this.rbacSrv.getPolicy();
    return result;
  }
}
