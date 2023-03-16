import { Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import { LoggerConfig } from './logger.config'

@Module({
  exports: [],
  providers: [],
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: [LoggerConfig.getPinoHttpConfig(), LoggerConfig.getStream()],
    }),
  ],
})
export class LoggerModule {}
