import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DataModule } from '@data/data.module';
import { DispatcherService } from './dispatcher.service';

@Module({
  imports: [DataModule],
  controllers: [MessagesController],
  providers: [MessagesService, DispatcherService],
  exports: [MessagesService],
})
export class MessagesModule {}
