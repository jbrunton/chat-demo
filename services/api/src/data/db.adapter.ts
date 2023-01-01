import {
  CreateTableCommand,
  CreateTableCommandInput,
  CreateTableCommandOutput,
  DeleteTableCommand,
  DynamoDBClient,
  DynamoDB,
  DescribeTableCommand,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  BatchGetCommandInput,
  BatchGetCommandOutput,
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { Injectable, Logger } from '@nestjs/common';

const config =
  process.env.NODE_ENV === 'development'
    ? {
        endpoint: 'http://localhost:8000',
        region: 'local',
        credentials: { accessKeyId: 'dummyid', secretAccessKey: 'dummysecret' },
      }
    : {
        region: 'us-east-1',
        endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
      };

const defaultTableName =
  process.env.NODE_ENV === 'test' ? 'Auth0Test-Test' : 'Auth0Test-Dev';

const tableParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'Id',
      AttributeType: 'S',
    },
    {
      AttributeName: 'Sort',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'Id',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'Sort',
      KeyType: 'RANGE',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: 'Auth0Test',
  StreamSpecification: {
    StreamEnabled: false,
  },
};

@Injectable()
export class DbAdapter {
  private logger = new Logger(DbAdapter.name);
  private readonly tableName = process.env.DB_TABLE_NAME || defaultTableName;
  private readonly docClient: DynamoDBDocumentClient;

  constructor() {
    this.logger.log(
      `Starting MessagesService with config: ${JSON.stringify({
        ...config,
        tableName: this.tableName,
      })}`,
    );
    const dbClient = new DynamoDBClient(config);
    this.docClient = DynamoDBDocumentClient.from(dbClient);
  }

  async putItem(
    params: Omit<PutCommandInput, 'TableName'>,
  ): Promise<PutCommandOutput> {
    return this.docClient.send(
      new PutCommand({ ...params, TableName: this.tableName }),
    );
  }

  async query(
    params: Omit<QueryCommandInput, 'TableName'>,
  ): Promise<QueryCommandOutput> {
    return this.docClient.send(
      new QueryCommand({ ...params, TableName: this.tableName }),
    );
  }

  async batchGet(keys: Record<string, any>[]): Promise<BatchGetCommandOutput> {
    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: keys,
        },
      },
    };
    return this.docClient.send(new BatchGetCommand(params));
  }

  async create(
    params: Omit<CreateTableCommandInput, 'TableName'> = tableParams,
  ): Promise<CreateTableCommandOutput> {
    this.validateSafeEnv();
    return this.docClient.send(
      new CreateTableCommand({ ...params, TableName: this.tableName }),
    );
  }

  async destroy() {
    this.validateSafeEnv();
    return this.docClient.send(
      new DeleteTableCommand({
        TableName: this.tableName,
      }),
    );
  }

  async waitForTable() {
    await waitUntilTableExists(
      { client: this.docClient, maxWaitTime: 20, minDelay: 1 },
      { TableName: this.tableName },
    );
    // const { Table } = await this.docClient.send(new DescribeTableCommand({
    //   TableName: this.tableName
    // }));
    // if (Table?.TableStatus !== 'ACTIVE') {
    //   await new Promise(resolve => setTimeout(resolve, 100));
    //   await this.waitForTable();
    // }
  }

  private validateSafeEnv() {
    const safeEnvironments = ['development', 'test'];
    if (!safeEnvironments.includes(process.env.NODE_ENV || '')) {
      throw new Error(
        `Expected safe NODE_ENV (${safeEnvironments}), was ${process.env.NODE_ENV}`,
      );
    }
  }
}
