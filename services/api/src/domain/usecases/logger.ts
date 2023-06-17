import { Logger as NestJSLogger } from '@nestjs/common';

export interface Logger
  extends Pick<NestJSLogger, 'error' | 'log' | 'warn' | 'debug'> {
  setContext(context: string): void;
}
