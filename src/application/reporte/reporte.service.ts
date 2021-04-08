import { Injectable } from '@nestjs/common';
import { generarPDF, descargarPDF } from '../../common/lib/pdf.module';

@Injectable()
export class ReporteService {
  async generar(plantilla: string, parametros: any, ruta: string, config: any) {
    await generarPDF(plantilla, parametros, ruta, config);
    return ruta;
  }

  async descargarBase64(ruta: string) {
    return descargarPDF(ruta);
  }
}
