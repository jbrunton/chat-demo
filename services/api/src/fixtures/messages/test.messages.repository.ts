import * as R from 'rambda';
import { DraftMessage, Message } from 'src/domain/entities/message.entity';
import { MessagesRepository } from '@features/messages/repositories/messages.repository';

export class TestMessagesRepository {
  private messages: Message[] = [];

  getData() {
    return this.messages;
  }

  setData(messages: Message[]) {
    this.messages = messages;
  }

  async storeMessage(params: DraftMessage, time: number): Promise<Message> {
    const id = `message:${time}`;
    const message = {
      id,
      time,
      ...R.pick(['content', 'authorId', 'roomId'], params),
    };
    this.messages.push(message);
    return message;
  }

  async getMessages(roomId: string): Promise<Message[]> {
    return R.filter((msg) => msg.roomId === roomId, this.messages);
  }

  static readonly Provider = {
    provide: MessagesRepository,
    useClass: TestMessagesRepository,
  };
}
