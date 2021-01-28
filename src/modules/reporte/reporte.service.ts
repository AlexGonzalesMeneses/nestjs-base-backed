import { Injectable } from '@nestjs/common';
import { generarPDF, descargarPDF } from '../../common/lib/pdf.module';

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
    await generarPDF(
      plantillaHtml,
      {
        titulo: 'Reporte de Ejemplo',
      },
      rutaGuardadoPdf,
      configPagina,
    );
    return rutaGuardadoPdf;
  }

  async generarBase64() {
    const nombreArchivo = 'reporte_base64.pdf';
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
    await generarPDF(
      plantillaHtml,
      {
        titulo: 'Reporte de Ejemplo Base64',
      },
      rutaGuardadoPdf,
      configPagina,
    );
    return descargarPDF(rutaGuardadoPdf);
  }
}
