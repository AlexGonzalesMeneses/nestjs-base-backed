import { Module } from '@nestjs/common';
import { ReporteService } from './reporte.service';
import { ReporteController } from './reporte.controller';

@Module({
  providers: [ReporteService],
  controllers: [ReporteController]
})
export class ReporteModule {}
