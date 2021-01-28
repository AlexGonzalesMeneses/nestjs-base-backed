import {
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Get,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ReporteService } from './reporte.service';

@Controller('reporte')
export class ReporteController {
  constructor(private reporteService: ReporteService) {}

  @Get('generar/buffer')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=test.pdf')
  async generar(@Res() res: Response) {
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
    const parametros = {
      titulo: 'Pagina de prueba',
    };
    await this.reporteService.generar(
      plantillaHtml,
      parametros,
      rutaGuardadoPdf,
      configPagina,
    );
    return res.download(rutaGuardadoPdf);
  }

  @Get('generar/base64')
  @HttpCode(HttpStatus.OK)
  async generarBase64(@Res() res: Response) {
    const nombreArchivo = 'reportebase64.pdf';
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
      titulo: 'Pagina de prueba Base64',
    };
    await this.reporteService.generar(
      plantillaHtml,
      parametros,
      rutaGuardadoPdf,
      configPagina,
    );
    const resultado = await this.reporteService.descargarBase64(
      rutaGuardadoPdf,
    );
    res.status(HttpStatus.OK).json({ data: resultado });
  }
}
