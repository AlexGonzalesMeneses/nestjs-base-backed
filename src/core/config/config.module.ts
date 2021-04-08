import { Module } from '@nestjs/common';
import { AuthorizationConfigModule } from './authorization/authorization.module';
import { DataBaseModule } from './database/database.module';
import { WinstonLoggerModule } from './logger/winston-logger.module';

@Module({
  imports: [DataBaseModule, AuthorizationConfigModule, WinstonLoggerModule],
})
export class ConfigCoreModule {}
