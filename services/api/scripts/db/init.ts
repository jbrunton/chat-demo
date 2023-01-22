import { DynamoDBAdapter } from '@data/adapters/dynamodb.adapter';
import { DataModule } from '@data/data.module';
import { runWithContext } from '../runWithContext';

runWithContext({
  rootModule: DataModule,
  run: async (app, logger) => {
    const db = app.get(DynamoDBAdapter);
    await db.create();
    logger.log(`Created table ${db.tableName}`);
  },
});
