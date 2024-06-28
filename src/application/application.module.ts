import { Module } from '@nestjs/common'
import { ParametroModule } from './parametro/parametro.module'
import { FacturaModule } from './factura/factura.module'

@Module({
  imports: [ParametroModule, FacturaModule],
})
export class ApplicationModule {}
