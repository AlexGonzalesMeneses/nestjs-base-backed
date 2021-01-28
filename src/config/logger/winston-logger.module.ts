import { Module } from '@nestjs/common';
import {
    utilities as nestWinstonModuleUtilities,
    WinstonModule,
  } from 'nest-winston';
  import * as winston from 'winston';
  

@Module({
    imports: [
        WinstonModule.forRoot({
            transports: [
              new winston.transports.Console({
                format: winston.format.combine(
                  winston.format.timestamp(),
                  nestWinstonModuleUtilities.format.nestLike(),
                ),
                level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
              }),
              new winston.transports.File({
                filename: process.env.ERROR_LOG_FILE_PATH || 'error.log',
                level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
              }),
              new winston.transports.Http({
                host: process.env.LOG_HOST,
                port: +process.env.LOG_PORT,
                path: process.env.LOG_PATH,
                auth: {username: process.env.LOG_AUTH_USERNAME, password: process.env.LOG_AUTH_PASSWORD},
                ssl: process.env.LOG_SSL,
                level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
              }),
            ],
          }),
    ]
})
export class WinstonLoggerModule {}

