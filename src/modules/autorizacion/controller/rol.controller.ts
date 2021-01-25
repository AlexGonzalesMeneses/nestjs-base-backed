import { Controller, Get } from '@nestjs/common';
import { RolService } from '../service/rol.service';
import { Rol } from '../entity/rol.entity';

@Controller('roles')
export class RolController {
  constructor(private rolService: RolService) {}

  @Get()
  recuperar(): Promise<Rol[]> {
    console.log(Rol);
    return this.rolService.recuperar();
  }
}
