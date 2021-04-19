import { Controller, Get } from '@nestjs/common';
import { RolService } from '../service/rol.service';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';

@Controller('roles')
export class RolController extends AbstractController {
  constructor(private rolService: RolService) {
    super();
  }

  @Get()
  async listar() {
    const result = await this.rolService.listar();
    return this.successList(result);
  }
}
