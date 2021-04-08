import { Module } from '@nestjs/common';
import { EntidadModule } from './entidad/entidad.module';
import { ParametroModule } from './parametro/parametro.module';
import { ReporteModule } from './reporte/reporte.module';

@Module({
  imports: [EntidadModule, ParametroModule, ReporteModule],
})
export class ApplicationModule {}
