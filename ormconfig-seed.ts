import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const SeedDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  migrations: ['database/seeds/*.ts'],
  entities: ['src/**/*.entity.ts'],
});

export default SeedDataSource;
