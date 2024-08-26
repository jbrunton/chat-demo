import 'tsconfig-paths/register';
import { DynamoDBAdapter } from '@data/adapters/dynamodb.adapter';
import { DataModule } from '@data/data.module';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@app/app.logger';

const setup = async () => {
  // Setup and teardown should be done manually for mutation tests
  if (process.env.SKIP_DB_SETUP === 'true') {
    return;
  }

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [DataModule, LoggerModule],
  }).compile();

  const db = moduleFixture.get(DynamoDBAdapter);
  await db.create();
};

export default setup;
