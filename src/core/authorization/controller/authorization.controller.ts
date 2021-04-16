import {
  Body,
  Controller,
  Inject,
  Post,
  Patch,
  Get,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthZManagementService } from 'nest-authz';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { AuthorizationServive } from './authorization.service';

@Controller('autorizacion')
export class AuthorizationController extends AbstractController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly authorizationService: AuthorizationServive,
    private readonly rbacSrv: AuthZManagementService,
  ) {
    super();
  }

  @Post('/politicas')
  async crearPolitica(@Body() politica) {
    const result = this.authorizationService.crearPolitica(politica);
    return this.successCreate(result);
  }

  @Patch('/politicas')
  async actualizarPolitica(@Body() politica, @Query() query) {
    const result = this.authorizationService.actualizarPolitica(
      query,
      politica,
    );
    return this.successUpdate(result);
  }

  @Get('/politicas')
  async listarPolitica() {
    const result = await this.authorizationService.listarPoliticas();
    return this.successList(result);
  }

  @Delete('/politicas')
  @HttpCode(204)
  async eliminarPolitica(@Query() query) {
    const result = this.authorizationService.elimininarPolitica(query);
    return this.successDelete(result);
  }

  @Get('/politicas/roles')
  async obtenerRoles() {
    const result = await this.authorizationService.obtenerRoles();
    return this.successList(result);
  }
}
