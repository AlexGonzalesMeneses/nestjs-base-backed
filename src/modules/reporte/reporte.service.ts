import { Injectable } from '@nestjs/common';
import { generarPDF } from '../../common/lib/pdf.module';

@Injectable()
export class ReporteService {

  async generar() {
    const html = 'src/templates/default.html';
    const rutaGuardadoPdf = `${process.env.PDF_PATH}test.pdf`;
    const configPagina = {
      pageSize: 'Letter',
      orientation: 'portrait',
      marginLeft: '0.5cm',
      marginRight: '0.5cm',
      marginTop: '0.5cm',
      marginBottom: '0.5cm',
      output: rutaGuardadoPdf
    };
    let resultado = generarPDF(
      html,
      {
        titulo: 'Reporte de Ejemplo'
      },
      rutaGuardadoPdf,
      configPagina
    );
    return resultado;
  }
}
