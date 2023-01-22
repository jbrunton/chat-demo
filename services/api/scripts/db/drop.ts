import { DataModule } from '../../src/data/data.module';
import { DBAdapter } from '../../src/data/db.adapter';
import { runWithContext } from '../runWithContext';

runWithContext({
  rootModule: DataModule,
  run: async (app, logger) => {
    const db = app.get(DBAdapter);
    await db.destroy();
    logger.log(`Dropped table ${db.tableName}`);
  },
});
