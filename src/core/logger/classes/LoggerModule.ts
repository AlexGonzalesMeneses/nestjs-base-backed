import { DynamicModule, INestApplication, Module } from '@nestjs/common'
import { PinoLogger, LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import { LoggerService } from './LoggerService'
import { LoggerOptions } from '../types'
import { HttpLogger } from 'pino-http'
import { LoggerConfig } from './LoggerConfig'
import { expressMiddleware } from 'cls-rtracer'

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerOptions = {}): DynamicModule {
    LoggerService.initializeWithoutPino(options)

    const loggerParams = LoggerService.getLoggerParams()
    if (!loggerParams) throw new Error('LoggerService no ha sido inicializado')

    const opts = LoggerConfig.getPinoHttpConfig(loggerParams)
    const stream = LoggerConfig.getMainStream(loggerParams)

    return {
      module: LoggerModule,
      providers: [LoggerService],
      exports: [LoggerService],
      imports: [
        PinoLoggerModule.forRoot({
          pinoHttp: [opts, stream],
        }),
      ],
    }
  }

  static async initialize(app: INestApplication) {
    const pinoLogger = await app.resolve<PinoLogger>(PinoLogger)
    const httpLogger = { logger: pinoLogger as unknown } as HttpLogger
    LoggerService.registerPinoInstance(httpLogger)

    app.use(expressMiddleware())
  }
}
