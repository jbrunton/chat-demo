import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { registerAs } from '@nestjs/config';
import * as assert from 'assert';

export type DatabaseConfig = {
  clientConfig: DynamoDBClientConfig;
  tableName: string;
};

const nodeEnv = process.env.NODE_ENV || 'production';

const productionConfig = (): DatabaseConfig => {
  const tableName = process.env.DB_TABLE_NAME;
  assert(tableName);
  if (!process.env.PROD_ONLY_ERROR) {
    throw new Error('Prod only error');
  }

  return {
    tableName,
    clientConfig: {
      region: 'us-east-1',
      endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
    },
  };
};

const localConfig = (): DatabaseConfig => {
  const tableName = nodeEnv === 'test' ? 'Auth0Test-Test' : 'Auth0Test-Dev';
  const port = nodeEnv === 'test' ? 8001 : 8000;
  return {
    tableName,
    clientConfig: {
      endpoint: `http://localhost:${port}`,
      region: 'local',
      credentials: { accessKeyId: 'dummyid', secretAccessKey: 'dummysecret' },
    },
  };
};

export default registerAs(
  'database',
  nodeEnv === 'production' ? productionConfig : localConfig,
);
