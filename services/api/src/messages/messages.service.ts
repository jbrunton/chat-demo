import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import * as crypto from 'crypto';
import { pick } from 'rambda';
import { Message } from './entities/message.entity';
import { DbAdapter } from 'src/data/db.adapter';
import { MessagesRepository } from 'src/data/messages/messages.repository';

const newMessageId = (time: number) => {
  const rand = crypto.randomBytes(4).toString('hex');
  return `Msg#${time}#${rand}`;
};

@Injectable()
export class MessagesService {
  constructor(private readonly repo: MessagesRepository) {}

  async create({ roomId, content }: CreateMessageDto): Promise<Message> {
    const time = new Date().getTime();
    const id = newMessageId(time);
    const message: Message = {
      id,
      content,
      time,
    };
    return await this.repo.storeMessage(roomId, message);
  }

  async findForRoom(roomId: string): Promise<Message[]> {
    return this.repo.getMessages(roomId);
  }
}
