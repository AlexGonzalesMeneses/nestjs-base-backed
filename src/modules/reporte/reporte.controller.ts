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

  @Get('generar')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=test.pdf')
  async generar(@Res() res: Response) {
    return res.download(await this.reporteService.generar());
  }
}
