import { Module } from '@nestjs/common';
import { DbAdapter } from './db.adapter';
import { MessagesRepository } from './messages/messages.repository';
import { UsersRepository } from './users/users.repository';

@Module({
  providers: [DbAdapter, MessagesRepository, UsersRepository],
  exports: [MessagesRepository, UsersRepository],
})
export class DataModule {}
