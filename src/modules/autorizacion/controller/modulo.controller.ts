import { Controller, Get } from '@nestjs/common';
import { Modulo } from '../entity/modulo.entity';
import { ModuloService } from '../service/modulo.service';

@Controller('modulos')
export class ModuloController {
  constructor(private moduloService: ModuloService) {}

  @Get()
  recuperar(): Promise<Modulo[]> {
    return this.moduloService.recuperar();
  }
}
