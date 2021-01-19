import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from './config';
console.log(config)
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: '172.17.0.3',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'database_db',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    logging: true,
  }