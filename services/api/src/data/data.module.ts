import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBAdapter } from './adapters/dynamodb.adapter';
import databaseConfig from '@config/database.config';
import { DBAdapter } from './db.adapter';

const DatabaseConfigModule = ConfigModule.forFeature(databaseConfig);

@Module({
  imports: [DatabaseConfigModule],
  providers: [
    {
      provide: DBAdapter,
      useClass: DynamoDBAdapter,
    },
  ],
  exports: [DBAdapter, DatabaseConfigModule],
})
export class DataModule {}
