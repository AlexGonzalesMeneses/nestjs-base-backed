import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { AuthorizationServive } from './authorization.service';

@Controller('autorizacion')
export class AuthorizationController extends AbstractController {
  constructor(private readonly authorizationService: AuthorizationServive) {
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
  async listarPoliticas() {
    const result = await this.authorizationService.listarPoliticas();
    return this.successList(result);
  }

  @Delete('/politicas')
  @HttpCode(204)
  async eliminarPolitica(@Query() query) {
    const result = this.authorizationService.eliminarPolitica(query);
    return this.successDelete(result);
  }

  @Get('/politicas/roles')
  async obtenerRoles() {
    const result = await this.authorizationService.obtenerRoles();
    return this.successList(result);
  }
}
