import {
  MessagesRepository,
  SaveMessageParams,
} from '@entities/messages.repository';
import * as R from 'rambda';
import { Message } from 'src/domain/entities/message.entity';

export class TestMessagesRepository extends MessagesRepository {
  private messages: Message[] = [];

  getData() {
    return this.messages;
  }

  setData(messages: Message[]) {
    this.messages = messages;
  }

  override async saveMessage(params: SaveMessageParams): Promise<Message> {
    const id = `message:${params.time}`;
    const message = {
      id,
      ...R.pick(['content', 'time', 'authorId', 'roomId'], params),
    };
    this.messages.push(message);
    return message;
  }

  override async getMessagesForRoom(roomId: string): Promise<Message[]> {
    return R.filter((msg) => msg.roomId === roomId, this.messages);
  }

  override async getAuthorHistory(authorId: string): Promise<Message[]> {
    return R.filter((msg) => msg.authorId === authorId, this.messages);
  }
}
