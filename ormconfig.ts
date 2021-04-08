import * as dotenv from 'dotenv';

dotenv.config();

export default [
  {
    name: 'connection',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['src/**/*.entity.ts'],
    migrations: ['database/migrations/*.ts'],
    cli: {
      migrationsDir: 'database/migrations',
    },
  },
  {
    name: 'seed',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migrations: ['database/seeds/*.ts'],
    entities: ['src/**/*.entity.ts'],
    cli: {
      migrationsDir: 'database/seeds',
    },
  },
];
