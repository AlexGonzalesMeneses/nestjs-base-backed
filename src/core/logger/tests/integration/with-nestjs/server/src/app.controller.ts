import { Controller, Get, Param, Query, Res } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/estado')
  getEstado() {
    const estado = this.appService.getEstado()
    return {
      finalizado: true,
      mensaje: estado,
    }
  }

  @Get('/not-found')
  getNotFound() {
    this.appService.getNotFound()
  }

  @Get('/error/:codigo')
  async getErrorPorCodigo(
    @Param('codigo') codigo: string,
    @Query() query: { [key: string]: string }
  ) {
    await this.appService.lanzarExcepcion(codigo, query)
  }

  @Get('/server-timeout')
  async getServerTimeout(@Res() res: any) {
    res.setTimeout(1000)
    await this.appService.getTimeout()
  }
}
