import { MessagesRepository } from '@entities/messages.repository';
import * as R from 'rambda';
import { DraftMessage, Message } from 'src/domain/entities/message.entity';

export class TestMessagesRepository extends MessagesRepository {
  private messages: Message[] = [];

  getData() {
    return this.messages;
  }

  setData(messages: Message[]) {
    this.messages = messages;
  }

  override async saveMessage(params: DraftMessage): Promise<Message> {
    const time = new Date().getTime();
    const id = `message:${time}`;
    const message = {
      id,
      time,
      ...R.pick(
        [
          'content',
          'time',
          'authorId',
          'roomId',
          'recipientId',
          'updatedEntities',
        ],
        params,
      ),
    };
    this.messages.push(message);
    return message;
  }

  override async getMessagesForRoom(roomId: string): Promise<Message[]> {
    return R.filter((msg) => msg.roomId === roomId, this.messages);
  }

  override async getAuthorHistory(authorId: string): Promise<Message[]> {
    return R.filter((msg) => msg.authorId === authorId, this.messages).sort(
      (msg) => -msg.time,
    );
  }
}
