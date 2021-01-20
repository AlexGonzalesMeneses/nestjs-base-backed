import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import * as path from 'path';
// import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Base Backend')
    .setDescription('Documentación base')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // const outputPath = path.resolve(process.cwd(), 'swagger.json');
  // writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8'});

  await app.listen(3000);
}
bootstrap();
