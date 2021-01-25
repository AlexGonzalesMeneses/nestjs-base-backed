import { Injectable } from '@nestjs/common';
import { generarPDF } from '../../common/lib/pdf.module';

@Injectable()
export class ReporteService {
  async generar() {
    const nombreArchivo = 'reporte.pdf';
    const plantillaHtml = 'src/templates/default.html';
    const rutaGuardadoPdf = `${process.env.PDF_PATH}${nombreArchivo}`;
    const configPagina = {
      pageSize: 'Letter',
      orientation: 'portrait',
      marginLeft: '0.5cm',
      marginRight: '0.5cm',
      marginTop: '0.5cm',
      marginBottom: '0.5cm',
      output: rutaGuardadoPdf,
    };
    const resultado = generarPDF(
      plantillaHtml,
      {
        titulo: 'Reporte de Ejemplo',
      },
      rutaGuardadoPdf,
      configPagina,
    );
    return resultado;
  }
}
