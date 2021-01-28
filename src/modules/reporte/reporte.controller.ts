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
    return res.download(await this.reporteService.generar());
  }

  @Get('generar/base64')
  @HttpCode(HttpStatus.OK)
  async generarBase64(@Res() res: Response) {
    const resultado = await this.reporteService.generarBase64();
    res.status(HttpStatus.OK).json({ data: resultado });
  }
}
