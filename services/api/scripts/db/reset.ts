import { DynamoDBAdapter } from '@data/adapters/dynamodb/dynamodb.adapter';
import { RunnableDataModule, runWithContext } from '../runWithContext';

runWithContext({
  rootModule: RunnableDataModule,
  run: async (app, logger) => {
    const db = app.get(DynamoDBAdapter);
    await db.destroy();
    await db.create();
    logger.log(`Reset table ${db.tableName}`);
  },
});
