import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import session from 'express-session'
import passport from 'passport'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { INestApplication } from '@nestjs/common'

import { TypeormStore } from 'connect-typeorm'
import { Session } from './core/authentication/entity/session.entity'
import { Logger } from 'nestjs-pino'
import { expressMiddleware } from 'cls-rtracer'
import dotenv from 'dotenv'

import {
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_NAME,
  SWAGGER_API_ROOT,
} from './common/constants'
import { DataSource } from 'typeorm'
import { LogService } from './core/logs/log.service'
import { NextFunction, Request, Response } from 'express'

dotenv.config()

export const SessionAppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: process.env.LOG_SQL === 'true',
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
    // logger: false,
  })
  app.useLogger(app.get(Logger))
  const configService = app.get(ConfigService)
  // swagger
  createSwagger(app)

  await SessionAppDataSource.initialize()

  // configuration app
  const repositorySession = SessionAppDataSource.getRepository(Session)

  app.use(expressMiddleware())

  app.use(
    session({
      secret: configService.get('SESSION_SECRET') || '',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      name: 'base.connect.sid',
      cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
      },
      store: new TypeormStore({ ttl: 3600, cleanupLimit: 2 }).connect(
        repositorySession
      ),
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(cookieParser())

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
  app.use(helmet.hidePoweredBy())
  app.use(helmet())
  app.setGlobalPrefix(configService.get('PATH_SUBDOMAIN') || 'api')

  app.use((req: Request, res: Response, next: NextFunction) => {
    const msg = `${req.method} ${req.originalUrl}`
    LogService.info(msg)
    next()
  })

  const port = configService.get('PORT')
  await app.listen(port)
  console.log(
    `Path de la aplicación configurada como /${configService.get(
      'PATH_SUBDOMAIN'
    )}`
  )
  console.log(`Aplicación iniciada en el puerto ${port}`)
}

function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document)
}

bootstrap()
