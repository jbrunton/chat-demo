import { DynamoDBAdapter } from '@data/adapters/dynamodb.adapter';
import { RunnableDataModule, runWithContext } from '../runWithContext';

runWithContext({
  rootModule: RunnableDataModule,
  run: async (app, logger) => {
    const db = app.get(DynamoDBAdapter);
    await db.destroy();
    logger.log(`Dropped table ${db.tableName}`);
  },
});
