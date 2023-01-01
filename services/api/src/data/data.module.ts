import { Module } from '@nestjs/common';
import { DynamoDBAdapter } from './adapters/dynamodb.adapter';
import { MessagesRepository } from './messages/messages.repository';
import { UsersRepository } from './users/users.repository';
import databaseConfig from '../config/database.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [DynamoDBAdapter, MessagesRepository, UsersRepository],
  exports: [MessagesRepository, UsersRepository],
})
export class DataModule {}
