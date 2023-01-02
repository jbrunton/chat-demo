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
  PutCommandOutput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import databaseConfig from '@config/database.config';
import * as assert from 'assert';
import { DBAdapter, DBItem } from '../db.adapter';

const defaultTableParams = {
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
export class DynamoDBAdapter extends DBAdapter {
  private logger = new Logger(DynamoDBAdapter.name);
  private readonly tableName;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(
    @Inject(databaseConfig.KEY) dbConfig: ConfigType<typeof databaseConfig>,
  ) {
    super();
    this.logger.log(
      `Creating database adapter with config: ${JSON.stringify(dbConfig)}`,
    );
    const dbClient = new DynamoDBClient(dbConfig.clientConfig);
    this.tableName = dbConfig.tableName;
    this.docClient = DynamoDBDocumentClient.from(dbClient);
  }

  async putItem<D>(item: DBItem<D>): Promise<PutCommandOutput> {
    return this.docClient.send(
      new PutCommand({ Item: item, TableName: this.tableName }),
    );
  }

  async query<D>(
    params: Omit<QueryCommandInput, 'TableName'>,
  ): Promise<DBItem<D>[]> {
    const output = await this.docClient.send(
      new QueryCommand({ ...params, TableName: this.tableName }),
    );

    return output.Items as any;
  }

  async batchGet<D>(keys: Record<string, any>[]): Promise<DBItem<D>[]> {
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

    return output.Responses[this.tableName] as any;
  }

  async create(
    params?: Omit<CreateTableCommandInput, 'TableName'>,
  ): Promise<CreateTableCommandOutput> {
    this.validateSafeEnv();
    const createTableParams = {
      ...(params ?? defaultTableParams),
      TableName: this.tableName,
    };
    return this.docClient.send(new CreateTableCommand(createTableParams));
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
