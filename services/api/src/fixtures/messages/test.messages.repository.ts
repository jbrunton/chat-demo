import * as R from 'rambda';
import { CreateMessageDto } from '@features/messages/dto/create-message.dto';
import { Message } from 'src/domain/entities/message.entity';
import { MessagesRepository } from '@features/messages/repositories/messages.repository';

export class TestMessagesRepository {
  private messages: Message[] = [];

  getData() {
    return this.messages;
  }

  setData(messages: Message[]) {
    this.messages = messages;
  }

  async storeMessage(
    params: CreateMessageDto,
    roomId: string,
    authorId: string,
    time: number,
  ): Promise<Message> {
    const id = `Msg#${time}`;
    const message = {
      id,
      content: params.content,
      time,
      authorId,
      roomId,
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
