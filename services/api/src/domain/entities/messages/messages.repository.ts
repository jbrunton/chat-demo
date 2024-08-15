import { DraftMessage, SentMessage } from './message';

export abstract class MessagesRepository {
  abstract saveMessage(params: DraftMessage): Promise<SentMessage>;
  abstract getMessagesForRoom(roomId: string): Promise<SentMessage[]>;
  abstract getAuthorHistory(authorId: string): Promise<SentMessage[]>;
}
