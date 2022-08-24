import { Controller, Get, UseGuards } from '@nestjs/common'
import { RolService } from '../service/rol.service'
import { AbstractController } from '../../../common/dto/abstract-controller.dto'
import { CasbinGuard } from '../guards/casbin.guard'
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard'
import { PinoLogger } from 'nestjs-pino'

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('autorizacion/roles')
export class RolController extends AbstractController {
  constructor(
    private rolService: RolService,
    private readonly logger: PinoLogger
  ) {
    super()
    this.logger.setContext(RolController.name)
  }

  @Get()
  async listar() {
    const result = await this.rolService.listar()
    return this.successList(result)
  }
}
