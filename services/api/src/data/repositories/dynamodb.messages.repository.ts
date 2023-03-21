import { DraftMessage, Message } from '@entities/message.entity';
import { MessagesRepository } from '@entities/messages.repository';
import { Injectable } from '@nestjs/common';
import { pick } from 'rambda';
import { DynamoDBAdapter } from '../adapters/dynamodb.adapter';
import { DbMessage } from '../adapters/schema';

@Injectable()
export class DynamoDBMessagesRepository extends MessagesRepository {
  constructor(private readonly adapter: DynamoDBAdapter) {
    super();
  }

  override async saveMessage(params: DraftMessage): Promise<Message> {
    const message = await this.adapter.Message.create(
      {
        ...params,
        time: new Date().getTime(),
      },
      { hidden: true },
    );
    return messageFromRecord(message);
  }

  override async getMessagesForRoom(roomId: string): Promise<Message[]> {
    const messages = await this.adapter.Message.find(
      { Id: roomId },
      { hidden: true },
    );
    return messages.map(messageFromRecord);
  }

  override async getAuthorHistory(authorId: string): Promise<Message[]> {
    const messages = await this.adapter.Message.scan(
      {},
      {
        where: '${authorId} = @{authorId}',
        substitutions: {
          authorId,
        },
        hidden: true,
      },
    );
    return messages.map(messageFromRecord);
  }
}

const messageFromRecord = (record: DbMessage): Message => ({
  id: record.Sort,
  ...pick(
    ['roomId', 'content', 'authorId', 'recipientId', 'time', 'updatedEntities'],
    record,
  ),
});
