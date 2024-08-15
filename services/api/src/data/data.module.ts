import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagesRepository } from '@entities/messages';
import databaseConfig from '@config/database.config';
import { DynamoDBMessagesRepository } from './repositories/dynamodb.messages.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { UsersRepository } from '@entities/users';
import { DynamoDBUsersRepository } from './repositories/dynamodb.users.repository';
import { DynamoDBAdapter } from './adapters/dynamodb.adapter';
import { DynamoDBRoomsRepository } from './repositories/dynamodb.rooms.repository';
import { MembershipsRepository } from '@entities/memberships.repository';
import { DynamoDBMembershipsRepository } from './repositories/dynamodb.memberships.repository';

export const DatabaseConfigModule = ConfigModule.forFeature(databaseConfig);

@Global()
@Module({
  imports: [DatabaseConfigModule],
  providers: [
    {
      provide: UsersRepository,
      useClass: DynamoDBUsersRepository,
    },
    {
      provide: MessagesRepository,
      useClass: DynamoDBMessagesRepository,
    },
    {
      provide: RoomsRepository,
      useClass: DynamoDBRoomsRepository,
    },
    {
      provide: MembershipsRepository,
      useClass: DynamoDBMembershipsRepository,
    },
    DynamoDBAdapter,
  ],
  exports: [
    UsersRepository,
    MessagesRepository,
    RoomsRepository,
    MembershipsRepository,
    DynamoDBAdapter,
    DatabaseConfigModule,
  ],
})
export class DataModule {}
