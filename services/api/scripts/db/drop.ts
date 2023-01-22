import { DynamoDBAdapter } from '@data/adapters/dynamodb.adapter';
import { DataModule } from '@data/data.module';
import { runWithContext } from '../runWithContext';

runWithContext({
  rootModule: DataModule,
  run: async (app, logger) => {
    const db = app.get(DynamoDBAdapter);
    await db.destroy();
    logger.log(`Dropped table ${db.tableName}`);
  },
});
