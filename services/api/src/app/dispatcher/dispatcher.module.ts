import { Dispatcher } from '@entities/messages/message';
import { Module } from '@nestjs/common';
import { EventEmitter } from 'stream';
import { DispatcherService } from './dispatcher.service';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: Dispatcher,
      useClass: DispatcherService,
    },
    EventEmitter,
  ],
  exports: [Dispatcher],
})
export class DispatcherModule {}
