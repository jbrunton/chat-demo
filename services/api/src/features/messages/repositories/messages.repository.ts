import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Message } from '../entities/message.entity';
import { DBAdapter, DBItem } from '@data/db.adapter';
import { getRandomString } from '@lib/util';

const newMessageId = (time: number) => {
  const rand = getRandomString();
  return `Msg#${time}#${rand}`;
};

type MessageData = {
  content: string;
  time: number;
  authorId: string;
  roomId: string;
};

type MessageItem = DBItem<MessageData>;

@Injectable()
export class MessagesRepository {
  constructor(private readonly db: DBAdapter) {}

  async storeMessage(
    message: CreateMessageDto,
    authorId: string,
    time: number,
  ): Promise<Message> {
    const Id = `Room#${message.roomId}`;
    const messageId = newMessageId(time);
    const data = {
      ...message,
      time,
      authorId,
    };
    const item: MessageItem = {
      Id,
      Sort: messageId,
      Data: data,
      Type: 'Message',
    };
    await this.db.putItem(item);
    return {
      id: messageId,
      ...data,
    };
  }

  async getMessages(roomId: string): Promise<Message[]> {
    const params = {
      KeyConditionExpression: 'Id = :roomId and begins_with(Sort,:filter)',
      ExpressionAttributeValues: {
        ':roomId': `Room#${roomId}`,
        ':filter': 'Msg#',
      },
    };
    console.log({ params });
    const messageItems = await this.db.query<MessageData>(params);
    return messageItems.map((item) => ({
      id: item.Sort,
      ...item.Data,
    }));
  }
}
