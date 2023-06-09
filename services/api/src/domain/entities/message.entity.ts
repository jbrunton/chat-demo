import { Observable } from 'rxjs';
import { User } from './user.entity';

export type Message = {
  id: string;
  time: number;
  content: string;
  authorId: string;
  roomId: string;
  recipientId?: string;
  updatedEntities?: string[];
};

export type PrivateMessage = Message & {
  recipientId: string;
};

export const isPrivate = (message: Message): message is PrivateMessage => {
  return (message as PrivateMessage).recipientId !== undefined;
};

export type DraftMessage = Omit<Message, 'id' | 'time'>;

export abstract class Dispatcher {
  abstract subscribe(roomId: string, user: User): Promise<Observable<unknown>>;
  abstract send(draft: DraftMessage): Promise<void>;
}
