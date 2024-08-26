import {
  DraftMessage,
  MessagesRepository,
  SentMessage,
} from '@entities/messages';
import * as R from 'rambda';

export class TestMessagesRepository extends MessagesRepository {
  private messages: SentMessage[] = [];

  getData() {
    return this.messages;
  }

  setData(messages: SentMessage[]) {
    this.messages = messages;
  }

  override async saveMessage(params: DraftMessage): Promise<SentMessage> {
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

  override async getMessagesForRoom(roomId: string): Promise<SentMessage[]> {
    return R.filter((msg) => msg.roomId === roomId, this.messages);
  }

  override async getAuthorHistory(authorId: string): Promise<SentMessage[]> {
    return R.filter((msg) => msg.authorId === authorId, this.messages).sort(
      (msg) => -msg.time,
    );
  }
}
