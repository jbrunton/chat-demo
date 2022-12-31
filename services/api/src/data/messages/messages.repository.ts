import { Injectable } from '@nestjs/common';
import { pick } from 'rambda';
import { Message } from 'src/messages/entities/message.entity';
import { DbAdapter } from '../db.adapter';

@Injectable()
export class MessagesRepository {
  constructor(private readonly db: DbAdapter) {}

  async storeMessage(roomId: string, message: Message): Promise<Message> {
    const Id = `Room#${roomId}`;
    const params = {
      Item: {
        Id,
        Sort: message.id,
        Data: pick(['content', 'time'], message),
        Type: 'Message',
      },
    };
    await this.db.putItem(params);
    return message;
  }

  async getMessages(roomId: string): Promise<Message[]> {
    const data = await this.db.query({
      KeyConditionExpression: 'Id = :roomId and begins_with(Sort,:filter)',
      ExpressionAttributeValues: {
        ':roomId': `Room#${roomId}`,
        ':filter': 'Msg#',
      },
    });
    const messages = data.Items?.map((item) => {
      const id = item.Sort;
      const data = item.Data;
      return {
        id,
        ...data,
      };
    });
    return messages || [];
  }
}
