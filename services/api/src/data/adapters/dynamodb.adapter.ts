import {
  CreateTableCommand,
  CreateTableCommandInput,
  CreateTableCommandOutput,
  DeleteTableCommand,
  DynamoDBClient,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import databaseConfig from '../../config/database.config';
import { NativeAttributeValue } from '@aws-sdk/util-dynamodb/dist-types/models';
import * as assert from 'assert';

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
export class DynamoDBAdapter {
  private logger = new Logger(DynamoDBAdapter.name);
  private readonly tableName;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(
    @Inject(databaseConfig.KEY) dbConfig: ConfigType<typeof databaseConfig>,
  ) {
    this.logger.log(
      `Creating database adapter with config: ${JSON.stringify(dbConfig)}`,
    );
    const dbClient = new DynamoDBClient(dbConfig.clientConfig);
    this.tableName = dbConfig.tableName;
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

  async batchGet<T = Record<string, NativeAttributeValue>>(
    keys: Record<string, NativeAttributeValue>[],
  ): Promise<T[]> {
    if (!keys.length) {
      return [];
    }

    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: keys,
        },
      },
    };

    const output = await this.docClient.send(new BatchGetCommand(params));
    assert(output.Responses);

    const response = output.Responses[this.tableName];
    assert(response);

    return <T[]>response;
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

  async waitForTable(timeout: number) {
    await waitUntilTableExists(
      { client: this.docClient, maxWaitTime: timeout, minDelay: 1 },
      { TableName: this.tableName },
    );
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
