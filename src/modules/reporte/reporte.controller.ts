import { Controller, HttpStatus, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReporteService } from './reporte.service';

@Controller('reporte')
export class ReporteController {
  constructor(private reporteService: ReporteService) {}

  @Get('generar')
  async generar(@Res() res: Response) {
    await this.reporteService.generar();
    res.status(HttpStatus.OK).json({});
  }
}
