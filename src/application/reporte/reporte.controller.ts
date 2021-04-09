import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { ReporteService } from './reporte.service';

@Controller('reporte')
export class ReporteController {
  constructor(private reporteService: ReporteService) {}

  @Get('generar/:tipo')
  @HttpCode(HttpStatus.OK)
  async generar(@Res() res: Response, @Param('tipo') tipo: string) {
    const nombreArchivo = `reporte${tipo}.pdf`;
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
    const parametros = {
      titulo: `Pagina de Prueba ${tipo}`,
    };
    await this.reporteService.generar(
      plantillaHtml,
      parametros,
      rutaGuardadoPdf,
      configPagina,
    );

    if (tipo === 'base64') {
      const resultado = await this.reporteService.descargarBase64(
        rutaGuardadoPdf,
      );
      res.status(HttpStatus.OK).json({ data: resultado });
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${nombreArchivo}`,
      );
      res.download(rutaGuardadoPdf);
    }
  }
}
