import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { SegipService } from './segip.service';
import { Response } from 'express';
import { SegipPersonaDTO } from './segipPersona.dto';

@Controller('iop/segip')
export class SegipController {
  constructor(private segipService: SegipService) {}

  @Post('contrastacion')
  async contrastacion(@Res() res: Response, @Body() datosPersona: SegipPersonaDTO) {
    const resultado = await this.segipService.contrastacion(datosPersona);
    res.status(HttpStatus.OK).json(resultado);
  }
}
