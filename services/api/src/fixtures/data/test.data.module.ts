import { MembershipsRepository } from '@entities/memberships.repository';
import { MessagesRepository } from '@entities/messages/messages.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { UsersRepository } from '@entities/users/users.repository';
import { Global, Module } from '@nestjs/common';
import { TestMembershipsRepository } from '../../data/repositories/test/test.memberships.repository';
import { TestMessagesRepository } from '../../data/repositories/test/test.messages.repository';
import { TestRoomsRepository } from '../../data/repositories/test/test.rooms.repository';
import { TestUsersRepository } from '../../data/repositories/test/test.users.repository';

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
