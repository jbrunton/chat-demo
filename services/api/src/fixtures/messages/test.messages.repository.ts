import * as R from 'rambda';
import { CreateMessageDto } from '@features/messages/dto/create-message.dto';
import { Message } from '@features/messages/entities/message.entity';

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
    authorId: string,
    time: number,
  ): Promise<Message> {
    const id = `Msg#${time}`;
    const message = {
      id,
      content: params.content,
      time,
      authorId,
      roomId: `Room#${params.roomId}`,
    };
    this.messages.push(message);
    return message;
  }

  async getMessages(roomId: string): Promise<Message[]> {
    return R.filter((msg) => msg.roomId === `Room#${roomId}`, this.messages);
  }
}
