import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  LoggerModule,
  printInfo,
  printRoutes,
  printLogo,
} from '../../../../../../logger'
import packageJson from '../package.json'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function bootstrap(port: number) {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  })

  await LoggerModule.initialize(app)
  app.setGlobalPrefix('api')

  const server = await app.listen(port)

  printRoutes(app)
  printLogo()
  printInfo({
    env: String(process.env.NODE_ENV),
    name: packageJson.name,
    port: String(port),
    version: packageJson.version,
  })

  return server
}

export default bootstrap
