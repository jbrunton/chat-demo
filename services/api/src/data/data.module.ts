import { Module } from '@nestjs/common';
import { DbAdapter } from './db.adapter';
import { MessagesRepository } from './messages/messages.repository';

@Module({
  providers: [DbAdapter, MessagesRepository],
  exports: [MessagesRepository],
})
export class DataModule {}
