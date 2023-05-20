import { MembershipsRepository } from '@entities/memberships.repository';
import { MessagesRepository } from '@entities/messages.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { UsersRepository } from '@entities/users.repository';
import { Global, Module } from '@nestjs/common';
import { TestMembershipsRepository } from './test.memberships.repository';
import { TestMessagesRepository } from './test.messages.repository';
import { TestRoomsRepository } from './test.rooms.repository';
import { TestUsersRepository } from './test.users.repository';

@Global()
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
    {
      provide: MembershipsRepository,
      useClass: TestMembershipsRepository,
    },
  ],
  exports: [
    UsersRepository,
    MessagesRepository,
    RoomsRepository,
    MembershipsRepository,
  ],
})
export class TestDataModule {}
