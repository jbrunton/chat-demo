import { Injectable } from '@nestjs/common';
import { DraftMessage, Message } from '@entities/message.entity';
import { DBAdapter } from '@data/db.adapter';

@Injectable()
export class MessagesRepository {
  constructor(private readonly db: DBAdapter) {}

  async storeMessage(message: DraftMessage, time: number): Promise<Message> {
    return this.db.saveMessage({ ...message, time });
  }

  async getMessages(roomId: string): Promise<Message[]> {
    return this.db.getMessagesForRoom(roomId);
  }
}
