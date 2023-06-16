import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import databaseConfig from '@config/database.config';
import { Dynamo } from 'dynamodb-onetable/Dynamo';
import { Model, Table } from 'dynamodb-onetable';
import {
  DbMembership,
  DbMessage,
  DbRoom,
  DbSchema,
  DbUser,
} from '@data/adapters/schema';

@Injectable()
export class DynamoDBAdapter {
  private readonly client: Dynamo;

  readonly tableName: string;
  private readonly table: Table;

  readonly User: Model<DbUser>;
  readonly Message: Model<DbMessage>;
  readonly Room: Model<DbRoom>;
  readonly Membership: Model<DbMembership>;

  constructor(
    @Inject(databaseConfig.KEY) dbConfig: ConfigType<typeof databaseConfig>,
    private readonly logger: ConsoleLogger,
  ) {
    this.logger.setContext(DynamoDBAdapter.name);
    this.logger.log(
      `Creating database adapter with config: ${JSON.stringify(dbConfig)}`,
    );
    const dbClient = new DynamoDBClient(dbConfig.clientConfig);
    this.client = new Dynamo({ client: DynamoDBDocumentClient.from(dbClient) });

    this.tableName = dbConfig.tableName;
    this.table = new Table({
      client: this.client,
      name: dbConfig.tableName,
      schema: DbSchema,
      partial: false,
    });
    this.User = this.table.getModel<DbUser>('User');
    this.Message = this.table.getModel<DbMessage>('Message');
    this.Room = this.table.getModel<DbRoom>('Room');
    this.Membership = this.table.getModel<DbMembership>('Membership');
  }

  async create(): Promise<void> {
    this.validateSafeEnv();
    console.log('creating table:', this.tableName);
    await this.table.createTable();
  }

  async destroy() {
    this.validateSafeEnv();
    console.log('destroying table:', this.tableName);
    await this.table.deleteTable('DeleteTableForever');
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
