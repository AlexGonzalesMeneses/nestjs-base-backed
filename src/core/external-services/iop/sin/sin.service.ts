import { Injectable, HttpService } from '@nestjs/common';
import { IopException } from 'src/common/exceptions/iop.exception';
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const datosCampos = {
        nit: datosSIN.Nit,
        usuario: datosSIN.Usuario,
        clave: datosSIN.Contrasena,
      };

      // const respuesta = await this.http.post('/login', datosCampos).toPromise();
      /* .pipe(
          map((response) => response.data),
          catchError((error) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ) */
      /* const { data: respuesta } = await this.http
        .post('/login', datosCampos)
        .toPromise(); */

      const { data: respuesta } = await this.http.get('/status1').toPromise();
      // https://ws.agetic.gob.bo/ajam/v1/status
      console.log(respuesta.data);
      /* if (
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
      } */
    } catch (e) {
      console.log('---------ERROR-*****--------');
      console.log(e.data, e.message, e.response);
      console.log('----------*****---------');
      /* return {
        resultado: false,
        mensaje: e.message,
      }; */
      throw new IopException('Error en el servicio de impuestos');
    }
  }
}
