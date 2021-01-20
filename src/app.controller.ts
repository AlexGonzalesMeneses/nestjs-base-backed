import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { Logger } from "nestjs-pino";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger
  ) {}

  @Get()
  getHello(): string {
    // Se puede enviar el contexto
    this.logger.log("getHello()", AppController.name);
    return this.appService.getHello();
  }
}
