import { AppController } from './app.controller'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ScheduleModule } from '@nestjs/schedule'
import { CoreModule } from './core/core.module'
import { ApplicationModule } from './application/application.module'
import { LoggerModule } from 'nestjs-pino'
import { LogService } from './core/logs/log.service'

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: [LogService.getPinoHttpConfig(), LogService.getStream()],
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
  ],
})
export class AppModule {}
