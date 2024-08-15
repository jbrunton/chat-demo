import { Observable } from 'rxjs';
import { User } from '../user.entity';

export type SentMessage = {
  id: string;
  time: number;
  content: string;
  authorId: string;
  roomId: string;
  recipientId?: string;
  updatedEntities?: string[];
};

export type PrivateMessage = SentMessage & {
  recipientId: string;
};

export const isPrivate = (message: SentMessage): message is PrivateMessage => {
  return (message as PrivateMessage).recipientId !== undefined;
};

export type DraftMessage = Omit<SentMessage, 'id' | 'time'>;

export abstract class Dispatcher {
  abstract subscribe(roomId: string, user: User): Promise<Observable<unknown>>;
  abstract send(draft: DraftMessage): Promise<void>;
}
