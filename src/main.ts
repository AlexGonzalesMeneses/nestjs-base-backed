import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { TypeormStore } from 'typeorm-store';
import { Session } from './core/authentication/entity/session.entity';
import { Logger } from 'nestjs-pino';
import { expressMiddleware } from 'cls-rtracer';

import {
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_NAME,
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_ROOT,
} from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  // swagger
  createSwagger(app);

  // configuration app
  const repository = getConnection().getRepository(Session);
  console.log('----------->', expressMiddleware);
  app.use(expressMiddleware());

  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      rolling: true,
      name: 'base.connect.sid',
      cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
      },
      store: new TypeormStore({ repository, expirationInterval: 3600000 }), //ms
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(helmet());

  app.setGlobalPrefix(configService.get('PATH_SUBDOMAIN'));
  const port = configService.get('PORT');
  await app.listen(port);
  console.log(
    `Path de la aplicación configurada como /${configService.get(
      'PATH_SUBDOMAIN',
    )}`,
  );
  console.log(`Aplicación iniciada en el puerto ${port}`);
}

function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);
}
bootstrap();
