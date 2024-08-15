import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MainModule } from './main.module';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.enableCors();

  const logger = await app.resolve(ConsoleLogger);
  logger.setContext('main');
  logger.log(`Running server on http://localhost:${port}`);

  const config = new DocumentBuilder()
    .setTitle('Chat Demo API')
    .setDescription('API docs for Chat Demo')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}
bootstrap();
