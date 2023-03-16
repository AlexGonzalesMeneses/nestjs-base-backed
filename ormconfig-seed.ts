import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { PrintSQL } from './src/core/logger/tools/print-sql'

dotenv.config()
process.env.FORCE_SQL_LOG = 'true'

const SeedDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  synchronize: false,
  logger: new PrintSQL(),
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['database/seeds/*.ts'],
})

export default SeedDataSource
