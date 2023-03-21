import { DraftMessage, Message } from './message.entity';

export abstract class MessagesRepository {
  abstract saveMessage(params: DraftMessage): Promise<Message>;
  abstract getMessagesForRoom(roomId: string): Promise<Message[]>;
  abstract getAuthorHistory(authorId: string): Promise<Message[]>;
}
