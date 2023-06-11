import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.enableCors();

  const logger = await app.resolve(ConsoleLogger);
  logger.setContext('main');
  logger.log(`Running server on PID=${process.pid}, port=${port}`);

  await app.listen(port);
}
bootstrap();
