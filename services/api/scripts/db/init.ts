import { DynamoDBAdapter } from '../../src/data/adapters/dynamodb.adapter';
import { DataModule } from '../../src/data/data.module';
import { runWithContext } from '../runWithContext';

runWithContext({
  rootModule: DataModule,
  run: async (app, logger) => {
    const db = app.get(DynamoDBAdapter);
    const { TableDescription } = await db.create();
    logger.log(
      `Created table ${TableDescription?.TableName} (${TableDescription?.TableArn})`,
    );
  },
});
