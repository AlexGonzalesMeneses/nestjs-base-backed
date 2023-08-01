import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import packageJson from '../package.json'
import { LoggerModule } from '../../../..'
import path from 'path'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ExceptionFilter } from './exception.filter'
import { AppMiddleware } from './app.middleware'
import { TimeoutInterceptor } from './timeout.interceptor'

@Module({
  imports: [
    LoggerModule.forRoot({
      appName: packageJson.name,
      level: 'error,warn,info,debug,trace',
      fileParams: {
        path: path.resolve(__dirname, '../../../log-storage'),
      },
      projectPath: path.resolve(__dirname, '../'),
      auditParams: {
        context: 'application,request,response',
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*')
  }
}
