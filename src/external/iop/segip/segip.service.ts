import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { SegipPersonaDTO } from './segipPersona.dto';

@Injectable()
export class SegipService {
    constructor(private http: HttpService) {}

    async contrastacion(datosPersona: SegipPersonaDTO) {
      try {
        const datosCampos = {
          Complemento: datosPersona.Complemento,
          NumeroDocumento: datosPersona.NumeroDocumento,
          Nombres: datosPersona.Nombres,
          PrimerApellido: datosPersona.PrimerApellido,
          ...datosPersona.SegundoApellido !== undefined && datosPersona.SegundoApellido !== ''
            ? { SegundoApellido: datosPersona.SegundoApellido }
            : {},
          FechaNacimiento: datosPersona.FechaNacimiento
        };

        const campos = Object.keys(datosCampos).map((dato) => {
          return `"${dato}":"${datosCampos[dato]}"`;
        }).join(', ');

        let urlContrastacion = encodeURI(`/v2/personas/contrastacion?tipo_persona=1&lista_campo={ ${campos} }`);
        let respuesta = await this.http.get(urlContrastacion).pipe(
          map(response => response.data),
        ).toPromise();

        const resultado = respuesta.ConsultaDatoPersonaContrastacionResult;
          if (resultado === null || resultado === undefined) {
            throw new Error('Servicio Segip: No se han podido obtener los datos solicitados');
          }
          if (resultado.CodigoRespuesta === '2') {
            const losDatos = JSON.parse(resultado.ContrastacionEnFormatoJson);
            if (losDatos.NumeroDocumento === 0) {
              throw new Error(`Servicio Segip: Numero de documento no coincide`);
            } else if (losDatos.Complemento === 0) {
              throw new Error(`Servicio Segip: Complemento no coincide`);
            } else if (losDatos.Nombres === 0) {
              throw new Error(`Servicio Segip: Nombres no coincide`);
            } else if (losDatos.PrimerApellido === 0) {
              throw new Error(`Servicio Segip: Primero apellido no coincide`);
            } else if (losDatos.SegundoApellido === 0) {
              throw new Error(`Servicio Segip: Segundo apellido no coincide`);
            } else if (losDatos.FechaNacimiento === 0) {
              throw new Error(`Servicio Segip: Fecha de nacimiento no coincide`);
            }
            return {
              resultado: true,
              mensaje: resultado.DescripcionRespuesta
            };
          } else if (resultado.CodigoRespuesta === '3') {
            throw new Error(`Servicio Segip: ${resultado.DescripcionRespuesta}`);
          } else if (resultado.CodigoRespuesta === '4') {
            throw new Error(`Servicio Segip: ${resultado.DescripcionRespuesta}`);
          } else if (resultado.CodigoRespuesta === '1') {
            throw new Error(`Servicio Segip: ${resultado.DescripcionRespuesta}`);
          } else if (resultado.CodigoRespuesta === '0') {
            throw new Error(`Servicio Segip: ${resultado.DescripcionRespuesta}`);
          }
          throw new Error('Servicio Segip: Error inesperado, respuesta desconocida.');
      } catch (e) {
        if (e.message.startsWith('Servicio Segip:')) {
          return {
            resultado: false,
            mensaje: e.message
          };
        }
        return {
          resultado: false,
          mensaje: 'Ocurrió un problema al obtener los datos de la persona'
        };
        return e;
      }
    }
}
