import { MessagesRepository } from '@entities/messages.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { UsersRepository } from '@entities/users.repository';
import { Module } from '@nestjs/common';
import { TestMessagesRepository } from './test.messages.repository';
import { TestRoomsRepository } from './test.rooms.repository';
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
    {
      provide: RoomsRepository,
      useClass: TestRoomsRepository,
    },
  ],
  exports: [UsersRepository, MessagesRepository, RoomsRepository],
})
export class TestDataModule {}
