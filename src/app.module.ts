import { AppController } from './app.controller'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ScheduleModule } from '@nestjs/schedule'
import { CoreModule } from './core/core.module'
import { ApplicationModule } from './application/application.module'
import { LoggerMiddleware } from './common/middlewares'
import { LoggerModule } from './core/logger'
import packageJson from '../package.json'
import { TimeoutInterceptor } from './common/interceptors'

import dotenv from 'dotenv'
dotenv.config()

@Module({
  imports: [
    LoggerModule.forRoot({
      appName: packageJson.name,
      level: process.env.LOG_LEVEL,
      hide: process.env.LOG_HIDE,
      fileParams: process.env.LOG_PATH
        ? {
            path: process.env.LOG_PATH,
            size: process.env.LOG_SIZE,
            rotateInterval: process.env.LOG_INTERVAL,
            compress: process.env.LOG_COMPRESS,
          }
        : undefined,
      lokiParams: process.env.LOG_URL
        ? {
            url: process.env.LOG_URL,
            username: process.env.LOG_USERNAME,
            password: process.env.LOG_PASSWORD,
            batching: process.env.LOG_BATCHING,
            batchInterval: process.env.LOG_BATCH_INTERVAL,
          }
        : undefined,
    }),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CoreModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(process.env.PATH_SUBDOMAIN || 'api')
  }
}
