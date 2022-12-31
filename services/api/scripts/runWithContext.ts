import { NestFactory } from '@nestjs/core';
import { INestApplicationContext, Logger } from '@nestjs/common';

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
