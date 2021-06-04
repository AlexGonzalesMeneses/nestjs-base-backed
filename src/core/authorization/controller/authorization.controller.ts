import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { AuthorizationService } from './authorization.service';
import { CasbinGuard } from '../guards/casbin.guard';

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('autorizacion')
export class AuthorizationController extends AbstractController {
  constructor(private readonly authorizationService: AuthorizationService) {
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
  async listarPoliticas(@Query() query) {
    const result = await this.authorizationService.listarPoliticas(query);
    return this.successListRows(result);
  }

  @Delete('/politicas')
  @HttpCode(204)
  async eliminarPolitica(@Query() query) {
    const result = this.authorizationService.eliminarPolitica(query);
    return this.successDelete(result);
  }

  @Get('/permisos')
  async obtenerRoles() {
    const result = await this.authorizationService.obtenerRoles();
    return this.successList(result);
  }
}
