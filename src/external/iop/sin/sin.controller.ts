import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SinService } from './sin.service';
import { Response } from 'express';
import { SINCredencialesDTO } from './credenciales.dto';

@Controller('iop/sin')
export class SinController {
  constructor(private SINService: SinService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Res() res: Response, @Body() datosSIN: SINCredencialesDTO) {
    const resultado = await this.SINService.login(datosSIN);
    res.status(HttpStatus.OK).json(resultado);
  }
}
