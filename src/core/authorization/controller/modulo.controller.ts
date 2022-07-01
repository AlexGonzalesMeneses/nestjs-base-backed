import {
  Body,
  Delete,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { ModuloService } from '../service/modulo.service';
import { CrearModuloDto } from '../dto/crear-modulo.dto';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { CasbinGuard } from '../guards/casbin.guard';

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('autorizacion/modulos')
export class ModuloController extends AbstractController {
  constructor(private moduloService: ModuloService) {
    super();
  }

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.moduloService.listar(paginacionQueryDto);
    return this.successListRows(result);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async crear(@Body() moduloDto: any) {
    const result = await this.moduloService.crear(moduloDto);
    return this.successCreate(result);
  }
  @Patch()
  @UsePipes(ValidationPipe)
  async upModulo(@Body() moduloDto: CrearModuloDto) {
    const result = await this.moduloService.actualizar(moduloDto);
    return this.successUpdate(result);
  }
  @Delete()
  @UsePipes(ValidationPipe)
  async deleteModulo(@Body() moduloDto: CrearModuloDto) {
    const result = await this.moduloService.eliminar(moduloDto);
    return this.successDelete(result);
  }
}
