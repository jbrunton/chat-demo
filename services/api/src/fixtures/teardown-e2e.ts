import 'tsconfig-paths/register';
import { DynamoDBAdapter } from '@data/adapters/dynamodb.adapter';
import { DataModule } from '@data/data.module';
import { Test, TestingModule } from '@nestjs/testing';

const setup = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [DataModule],
  }).compile();

  const db = moduleFixture.get(DynamoDBAdapter);
  await db.destroy();
};

export default setup;
