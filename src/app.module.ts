import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from './core/core.module';
import { ApplicationModule } from './application/application.module';
import { LoggerModule } from 'nestjs-pino';
import { LogService } from './core/logs/log.service';
console.log(LogService);
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CoreModule,
    ApplicationModule,
    // LoggerModule.forRoot(), // This works! :D
    LoggerModule.forRoot({
      pinoHttp: LogService.getPinoHttpConfig(),
    }),
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
