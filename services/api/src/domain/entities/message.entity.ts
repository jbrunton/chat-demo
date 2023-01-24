export class Message {
  id: string;
  content: string;
  time: number;
  authorId: string;
  roomId: string;
  recipientId?: string;
  updatedEntities?: string[];
}

export type PublicMessage<T = Message> = Omit<T, 'recipientId'>;

export const isPublic = (message: Message): message is PublicMessage => {
  return message.recipientId === undefined;
};

export type PrivateMessage = Message & {
  recipientId: string;
};

export const isPrivate = (message: Message): message is PrivateMessage => {
  return !isPublic(message);
};

export type Draft<T = Message> = Omit<T, 'id' | 'time'>;
export type DraftMessage = Draft<Message>;
