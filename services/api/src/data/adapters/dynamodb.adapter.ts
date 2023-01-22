import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import databaseConfig from '@config/database.config';
import { Dynamo } from 'dynamodb-onetable/Dynamo';
import { Model, Table } from 'dynamodb-onetable';
import { DbMessage, DbRoom, DbSchema, DbUser } from '@data/adapters/schema';
import { User } from '@entities/user.entity';
import {
  CreateRoomParams,
  DBAdapter,
  SaveMessageParams,
  SaveUserParams,
} from '@data/db.adapter';
import { Message } from '@entities/message.entity';
import { Room } from '@entities/room.entitiy';
import { pick } from 'rambda';

@Injectable()
export class DynamoDBAdapter extends DBAdapter {
  private logger = new Logger(DynamoDBAdapter.name);
  private readonly docClient: DynamoDBDocumentClient;
  private readonly client: Dynamo;

  readonly tableName: string;
  private readonly table: Table;

  private readonly User: Model<DbUser>;
  private readonly Message: Model<DbMessage>;
  private readonly Room: Model<DbRoom>;

  constructor(
    @Inject(databaseConfig.KEY) dbConfig: ConfigType<typeof databaseConfig>,
  ) {
    super();
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
  }

  override async create(): Promise<void> {
    this.validateSafeEnv();
    await this.table.createTable();
  }

  async destroy() {
    this.validateSafeEnv();
    await this.table.deleteTable('DeleteTableForever');
  }

  override async saveUser(params: SaveUserParams): Promise<User> {
    const user = await this.User.create(params, { exists: null, hidden: true });
    return userFromRecord(user);
  }

  override async getUser(id: string): Promise<User> {
    const user = await this.User.get(
      { Id: id, Sort: 'user' },
      { hidden: true },
    );
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return userFromRecord(user);
  }

  override async saveMessage(params: SaveMessageParams): Promise<Message> {
    const message = await this.Message.create(params);
    return messageFromRecord(message);
  }

  override async getMessagesForRoom(roomId: string): Promise<Message[]> {
    const messages = await this.Message.find({ Id: roomId });
    return messages.map(messageFromRecord);
  }

  override async createRoom(params: CreateRoomParams): Promise<Room> {
    const room = await this.Room.create(params, { hidden: true });
    return roomFromRecord(room);
  }

  override async getRoom(id: string): Promise<Room> {
    const room = await this.Room.get(
      { Id: id, Sort: 'room' },
      { hidden: true },
    );
    if (!room) {
      throw new NotFoundException(`Room ${id} not found`);
    }
    return roomFromRecord(room);
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

const userFromRecord = (record: DbUser): User => ({
  id: record.Id,
  ...pick(['sub', 'name', 'picture'], record),
});

const messageFromRecord = (record: DbMessage): Message => ({
  id: record.Id,
  ...pick(['roomId', 'content', 'authorId', 'recipientId', 'time'], record),
});

const roomFromRecord = (record: DbRoom): Room => ({
  id: record.Id,
  ...pick(['name', 'ownerId'], record),
});
