import { AppLogger } from '@app/app.logger';
import { ConsoleLogger, Global, Module } from '@nestjs/common';
import { mock } from 'jest-mock-extended';

@Global()
@Module({
  providers: [
    {
      provide: ConsoleLogger,
      useValue: mock<AppLogger>(),
    },
  ],
  exports: [ConsoleLogger],
})
export class MockLoggerModule {}
