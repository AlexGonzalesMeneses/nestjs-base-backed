import { Module } from '@nestjs/common';
import { ParametroModule } from './parametro/parametro.module';
import { ReporteModule } from './reporte/reporte.module';

@Module({
  imports: [ParametroModule, ReporteModule],
})
export class ApplicationModule {}
