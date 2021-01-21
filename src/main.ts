import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Base Backend')
    .setDescription('Documentación base')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix(configService.get('PATH_SUBDOMAIN'));
  const port = configService.get('PORT');
  await app.listen(port);
  console.log(`Aplicación iniciada en el puerto ${port}`);
}
bootstrap();
