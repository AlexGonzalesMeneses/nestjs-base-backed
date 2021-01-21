import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import {
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_NAME,
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_ROOT,
} from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      name: 'base.connect.sid',
      cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix(configService.get('PATH_SUBDOMAIN'));

  app.enableCors();
  app.use(helmet());
  app.use(csurf());

  const port = configService.get('PORT');
  await app.listen(port);
  console.log(`Aplicación iniciada en el puerto ${port}`);
}
bootstrap();
