import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolService } from '../service/rol.service';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { CasbinGuard } from '../guards/casbin.guard';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('autorizacion/roles')
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
