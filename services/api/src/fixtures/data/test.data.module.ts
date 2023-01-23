import { MessagesRepository } from '@entities/messages.repository';
import { UsersRepository } from '@entities/users.repository';
import { Module } from '@nestjs/common';
import { TestMessagesRepository } from './test.messages.repository';
import { TestUsersRepository } from './test.users.repository';

@Module({
  providers: [
    {
      provide: UsersRepository,
      useClass: TestUsersRepository,
    },
    {
      provide: MessagesRepository,
      useClass: TestMessagesRepository,
    },
  ],
  exports: [UsersRepository, MessagesRepository],
})
export class TestDataModule {}
