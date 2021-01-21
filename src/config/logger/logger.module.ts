import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
        autoLogging: process.env.NODE_ENV !== 'test',
        prettyPrint:
          process.env.NODE_ENV === 'development'
            ? {
                colorize: true,
                levelFirst: true,
                translateTime: 'UTC:mm/dd/yyyy, h:MM:ss TT Z',
              }
            : {},
      },
    }),
  ],
})
export class LogsModule {}
