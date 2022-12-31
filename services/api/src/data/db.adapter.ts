import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
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
    ? { endpoint: 'http://localhost:8000', region: 'local' }
    : {
        region: 'us-east-1',
        endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
      };

@Injectable()
export class DbAdapter {
  private logger = new Logger(DbAdapter.name);
  private readonly tableName = process.env.DB_TABLE_NAME || 'Auth0Test';
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
}
