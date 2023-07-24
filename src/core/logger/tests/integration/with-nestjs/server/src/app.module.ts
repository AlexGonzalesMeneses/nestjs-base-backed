import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import packageJson from '../package.json'
import { LoggerModule } from '../../../../../../logger'
import path from 'path'
import { APP_FILTER } from '@nestjs/core'
import { ExceptionFilter } from './exception.filter'
import { AppMiddleware } from './app.middleware'

@Module({
  imports: [
    LoggerModule.forRoot({
      appName: packageJson.name,
      level: 'trace',
      fileParams: {
        path: path.resolve(__dirname, '../logs'),
      },
      projectPath: path.resolve(__dirname, '../'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*')
  }
}
