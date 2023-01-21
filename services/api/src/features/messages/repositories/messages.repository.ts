import { Injectable } from '@nestjs/common';
import { Draft, Message } from '@entities/message.entity';
import { DBAdapter, DBItem } from '@data/db.adapter';
import { getRandomString } from '@lib/util';

const newMessageId = (time: number) => {
  const rand = getRandomString();
  return `msg_${time}_${rand}`;
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

  async storeMessage(message: Draft<Message>, time: number): Promise<Message> {
    const messageId = newMessageId(time);
    const data = {
      ...message,
      time,
    };
    const item: MessageItem = {
      Id: message.roomId,
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
        ':roomId': roomId,
        ':filter': 'msg_',
      },
    };
    const messageItems = await this.db.query<MessageData>(params);
    return messageItems.map((item) => ({
      id: item.Sort,
      ...item.Data,
    }));
  }
}
