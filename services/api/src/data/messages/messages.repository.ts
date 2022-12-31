import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Message } from 'src/messages/entities/message.entity';
import { DynamoDBAdapter } from '../adapters/dynamodb.adapter';

const newMessageId = (time: number) => {
  const rand = crypto.randomBytes(4).toString('hex');
  return `Msg#${time}#${rand}`;
};

@Injectable()
export class MessagesRepository {
  constructor(private readonly db: DynamoDBAdapter) {}

  async storeMessage(
    message: CreateMessageDto,
    time: number,
  ): Promise<Message> {
    const Id = `Room#${message.roomId}`;
    const messageId = newMessageId(time);
    const data = {
      ...message,
      time,
    };
    const params = {
      Item: {
        Id,
        Sort: messageId,
        Data: data,
        Type: 'Message',
      },
    };
    await this.db.putItem(params);
    return {
      id: messageId,
      ...data,
    };
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
