import { Module } from '@nestjs/common';
import { EntidadController } from './entidad.controller';
import { EntidadService } from './entidad.service';

@Module({
  controllers: [EntidadController],
  providers: [EntidadService]
})
export class EntidadModule {}
