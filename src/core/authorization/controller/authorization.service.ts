import { Injectable, Query } from '@nestjs/common';
import { AuthZManagementService } from 'nest-authz';
import { ModuloService } from '../service/modulo.service';
import { Modulo } from '../entity/modulo.entity';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly rbacSrv: AuthZManagementService,
    private readonly moduloService: ModuloService,
  ) {}

  async listarPoliticas(@Query() query) {
    const { limite, pagina, pol, app } = query;

    const politicas = await this.rbacSrv.getPolicy();

    let result = politicas.map((politica) => ({
      sujeto: politica[0],
      objeto: politica[1],
      accion: politica[2],
      app: politica[3],
    }));

    if (pol != '') {
      result = result.filter(
        (r) => r.sujeto.search(pol) > 0 || r.objeto.search(pol) > 0,
      );
    }
    if (app != '') {
      result = result.filter((r) => r.app === app);
    }

    if (!limite || !pagina) {
      return [result, result.length];
    }
    const i = limite * (pagina - 1);
    const f = limite * pagina;

    const subset = result.slice(i, f);
    return [subset, result.length];
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
    return await this.rbacSrv.getFilteredPolicy(3, 'frontend');
  }

  async obtenerPermisosPorRol(rol: string) {
    const politicas = await this.rbacSrv.getFilteredPolicy(3, 'frontend');
    const modulos = await this.moduloService.listarTodo();
    const politicasRol = politicas.filter((politica) => politica[0] === rol);
    return modulos
      .map((modulo) => ({
        ...modulo,
        subModulo: modulo.subModulo.filter((subModulo) =>
          politicasRol.some((politica) => politica[1] === subModulo.url),
        ),
      }))
      .filter((modulo) => modulo.subModulo.length > 0);
  }
}
