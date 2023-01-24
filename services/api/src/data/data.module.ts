import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessagesRepository } from '@entities/messages.repository';
import databaseConfig from '@config/database.config';
import { DynamoDBMessagesRepository } from './repositories/dynamodb.messages.repository';
import { RoomsRepository } from '@entities/rooms.repository';
import { UsersRepository } from '@entities/users.repository';
import { DynamoDBUsersRepository } from './repositories/dynamodb.users.repository';
import { DynamoDBAdapter } from './adapters/dynamodb.adapter';
import { DynamoDBRoomsRepository } from './repositories/dynamodb.rooms.repository';

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
    DynamoDBAdapter,
  ],
  exports: [
    UsersRepository,
    MessagesRepository,
    RoomsRepository,
    DynamoDBAdapter,
    DatabaseConfigModule,
  ],
})
export class DataModule {}
