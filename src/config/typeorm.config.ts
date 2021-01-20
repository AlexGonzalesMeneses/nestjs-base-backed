import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from './config';
console.log(config)

export const typeOrmConfig: TypeOrmModuleOptions = config;
