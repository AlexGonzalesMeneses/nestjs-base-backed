import { Controller, Get } from '@nestjs/common';
import { RolService } from '../service/rol.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Rol } from '../entity/rol.entity';

@Controller('roles')
export class RolController {
  constructor(private rolService: RolService) {}

  @Get()
  recuperar(): Promise<Rol[]> {
    // console.log(Rol);
    return this.rolService.recuperar();
  }
}
