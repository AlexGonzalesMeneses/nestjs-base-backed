import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from './core/core.module';
import { ApplicationModule } from './application/application.module';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { createWriteStream } from 'pino-http-send';

const stream = createWriteStream({
  url: 'http://localhost:3005',
  batchSize: 2,
  log: true,
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CoreModule,
    ApplicationModule,
    // LoggerModule.forRoot(), // This works! :D
    LoggerModule.forRoot({
      pinoHttp: {
        logger: pino(
          {
            level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
            prettyPrint: process.env.NODE_ENV !== 'production',
          },
          stream,
        ),
      },
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
