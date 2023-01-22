import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  logger.log(`Running server on PID=${process.pid}, port=${port}`);
  await app.listen(port);
}
bootstrap();
