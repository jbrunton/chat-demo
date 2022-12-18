import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log(`Running server on PID=${process.pid}, port=${port}`);
  await app.listen(port);
}
bootstrap();
