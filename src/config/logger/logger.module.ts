import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp:
        process.env.NODE_ENV === 'production'
          ? {
              timestamp: () =>
                `,"time":"${new Date(Date.now()).toISOString()}"`,
            }
          : {
              prettyPrint: {
                colorize: true,
                levelFirst: true,
                translateTime: true,
              },
            },
    })
  ],
})
export class LogsModule {}