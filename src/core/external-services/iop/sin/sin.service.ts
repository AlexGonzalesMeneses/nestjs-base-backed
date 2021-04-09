import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { SINCredencialesDTO } from './credenciales.dto';

@Injectable()
export class SinService {
  constructor(private http: HttpService) {}

  /**
   * @title Login
   * @description Metodo para verificar si la información de la empresa existe en el servicio del SIN
   * @param datosSIN Objeto de datos con la información de la empresa
   */
  async login(datosSIN: SINCredencialesDTO) {
    try {
      const datosCampos = {
        nit: datosSIN.Nit,
        usuario: datosSIN.Usuario,
        clave: datosSIN.Contrasena,
      };

      const respuesta = await this.http
        .post('/login', datosCampos)
        .pipe(map((response) => response.data))
        .toPromise();

      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/You cannot consume this service/) !== null &&
        respuesta.message.match(/You cannot consume this service/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no tiene permisos para usar este servicio.`,
        );
      }
      if (
        !respuesta.estado &&
        respuesta.message &&
        respuesta.message.match(/no API found with those valuese/) !== null &&
        respuesta.message.match(/no API found with those valuese/).length === 1
      ) {
        throw new Error(
          `Error con el Servicio Web SIN: no se encontró el servicio solicitado.`,
        );
      }
      if (respuesta.Autenticado) {
        return {
          resultado: true,
          mensaje: respuesta.Estado,
        };
      } else {
        throw new Error(respuesta.Mensaje || 'Error con el servicio web SIN');
      }
    } catch (e) {
      return {
        resultado: false,
        mensaje: e.message,
      };
    }
  }
}
