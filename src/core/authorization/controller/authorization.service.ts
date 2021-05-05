import { Injectable } from '@nestjs/common';
import { AuthZManagementService } from 'nest-authz';
import { totalRowsResponse } from '../../../common/lib/http.module';
import { ModuloService } from '../service/modulo.service';
@Injectable()
export class AuthorizationService {
  constructor(
    private readonly rbacSrv: AuthZManagementService,
    private readonly moduloService: ModuloService,
  ) {}

  async listarPoliticas(tipo: string) {
    const politicas = await this.rbacSrv.getFilteredPolicy(3, tipo);
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
    await this.eliminarPolitica(politica);
    await this.rbacSrv.addPolicy(sujeto, objeto, accion, app);
  }

  async eliminarPolitica(politica) {
    const { sujeto, objeto, accion, app } = politica;
    await this.rbacSrv.removePolicy(sujeto, objeto, accion, app);
    return politica;
  }

  async obtenerRoles() {
    const result = await this.rbacSrv.getFilteredPolicy(3, 'frontend');
    return result;
  }

  async obtenerPermisosPorRol(rol: string) {
    const politicas = await this.rbacSrv.getFilteredPolicy(3, 'frontend');
    const modulos = await this.moduloService.listarTodo();
    const politicasRol = politicas.filter((politica) => politica[0] === rol);

    const politicasModulo = modulos.filter((modulo) => {
      if (modulo?.subModulo?.length > 0) {
        const subModulos = modulo.subModulo.filter((subModulo) =>
          politicasRol.some((politica) => politica[1] === subModulo.url),
        );
        modulo.subModulo = subModulos;
        return modulo;
      }
      return politicasRol.some((politica) => politica[1] === modulo.url);
    });
    return politicasModulo;
  }
}
