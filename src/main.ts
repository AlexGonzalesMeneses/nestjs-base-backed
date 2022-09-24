import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import session from 'express-session'
import passport from 'passport'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { INestApplication } from '@nestjs/common'
import packageJson from '../package.json'
import { TypeormStore } from 'connect-typeorm'
import { Session } from './core/authentication/entity/session.entity'
import { expressMiddleware } from 'cls-rtracer'
import dotenv from 'dotenv'
import ip from 'ip'

import {
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_NAME,
  SWAGGER_API_ROOT,
} from './common/constants'
import { DataSource } from 'typeorm'
import { LoggerService } from './core/logger/logger.service'
import { NextFunction, Request, Response } from 'express'
import { COLOR } from './core/logger/constants'

dotenv.config()

export const SessionAppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  synchronize: false,
  logging: process.env.LOG_SQL === 'true',
  entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
})

const logger = LoggerService.getInstance('main')

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  })

  app.useLogger(logger)

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

  if (process.env.NODE_ENV !== 'production') {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method.toLowerCase() === 'options') return next()
      logger.trace(`${req.method} ${req.originalUrl.split('?')[0]}`)
      return next()
    })
  }

  const port = configService.get('PORT')
  await app.listen(port)

  logger.trace(`

                                 $@@.
                                  $@@@  @@,
                                   ]@@"g@@@@g
                                   @,@@@@@@@@@
                ,ggg&@@@@@@BNggg,  P@@@@@@@@@@@
            ,g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@K
          g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@P   ,
       ,g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    @@g
 ,g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"   g@@@@
$@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@P   g@@@@@@@p
]@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@PP'  ,g@@@@@@@@@@@p
  ]@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@p
    MB@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
     * @"          "PB@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                       "N@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                          %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                            $@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                             %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
               ,ggg           $@@@@@B@@@@@@@@@@@@@@@@@@@@@@P
              @@@@@        g@Np@@@@@ @@@@@@@@@@@@@@@@@R@@@@
              @@@@@@    @g@@@@@@@@@  @@@@@@@@@@@@@@@@@ @@@
              ]@@@@@@@@@@@@@@@@@@P  ]@@@@@@@@@@@@@@@@P $@
               "B@@@@@@@@@@@@@@P   ,@@@@@@@@@@@@@@@@P  P
               "PB@@@@@@@@BPP     g@@@@@@@@@@@P]@@@P
                                ,@@@@B@@@@@@P  @@P
                               ""  ,g@@@@@P  ,@P'
 NestJS Base Backend             ,@@@@@P-   7P
                              ,@@@P-
  `)

  const appName = packageJson.name
  const appVersion = packageJson.version
  const nodeEnv = configService.get('NODE_ENV')
  const appLocalUrl = `http://localhost:${port}`
  const appNetworkUrl = `http://${ip.address()}:${port}`

  const serviceInfo = `${appName} v${appVersion}

${COLOR.RESET} - Servicio    : ${COLOR.GREEN}Activo
${COLOR.RESET} - Entorno     : ${COLOR.GREEN}${nodeEnv}
${COLOR.RESET} - URL (local) : ${COLOR.GREEN}${appLocalUrl}
${COLOR.RESET} - URL (red)   : ${COLOR.GREEN}${appNetworkUrl}${COLOR.RESET}
  `
  logger.info(serviceInfo)
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
