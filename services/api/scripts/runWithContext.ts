import { NestFactory } from '@nestjs/core';
import { INestApplicationContext, Logger, Module } from '@nestjs/common';
import { DataModule } from '@data/data.module';
import { LoggerModule } from '@app/app.logger';

const logger = new Logger();

export type RunWithContextParams = {
  rootModule: any;
  run: (app: INestApplicationContext, logger: Logger) => Promise<void>;
};

export const runWithContext = (params: RunWithContextParams) => {
  const run = async () => {
    const { rootModule, run } = params;
    try {
      const app = await NestFactory.createApplicationContext(rootModule);
      await run(app, logger);
    } catch (e) {
      logger.error(e);
    }
  };
  run();
};

@Module({
  imports: [DataModule, LoggerModule],
})
export class RunnableDataModule {}
