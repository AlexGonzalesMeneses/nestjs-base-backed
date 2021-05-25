import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  /**
   * Metodo para encriptar un password
   * @param password contraeña
   */
  static armarQueryParams(datos) {
    return Object.keys(datos)
      .map((dato) => `"${dato}":"${datos[dato]}"`)
      .join(', ');
  }
}
