import { DraftMessage, Message } from './message.entity';

export type SaveMessageParams = DraftMessage & { time: number };

export abstract class MessagesRepository {
  abstract saveMessage(params: SaveMessageParams): Promise<Message>;
  abstract getMessagesForRoom(roomId: string): Promise<Message[]>;
}
