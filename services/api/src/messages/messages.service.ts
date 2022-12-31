import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import * as crypto from 'crypto';
import { pick } from 'rambda';
import { Message } from './entities/message.entity';
import { DbAdapter } from 'src/data/db.adapter';

const newMessageId = (time: number) => {
  const rand = crypto.randomBytes(4).toString('hex');
  return `Msg#${time}#${rand}`;
};

@Injectable()
export class MessagesService {
  constructor(private readonly db: DbAdapter) {}

  async create({ roomId, content }: CreateMessageDto): Promise<Message> {
    const time = new Date().getTime();
    const id = newMessageId(time);
    const message: Message = {
      id,
      content,
      time,
    };
    const params = {
      Item: {
        Id: `Room#${roomId}`,
        Sort: id,
        Data: pick(['content', 'time'], message),
        Type: 'Message',
      },
    };
    await this.db.putItem(params);
    return message;
  }

  async findForRoom(roomId: string): Promise<Message[]> {
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
