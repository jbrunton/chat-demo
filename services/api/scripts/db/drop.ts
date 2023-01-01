import { DataModule } from '../../src/data/data.module';
import { DynamoDBAdapter } from '../../src/data/adapters/dynamodb.adapter';
import { runWithContext } from '../runWithContext';

runWithContext({
  rootModule: DataModule,
  run: async (app, logger) => {
    const db = app.get(DynamoDBAdapter);
    const { TableDescription } = await db.destroy();
    logger.log(
      `Dropped table ${TableDescription?.TableName} (${TableDescription?.TableArn})`,
    );
  },
});
