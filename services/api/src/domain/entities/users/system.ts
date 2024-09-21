import { SentMessage, DraftMessage } from '../messages/message';
import { User } from './user';

export const systemUser: User = Object.freeze({
  id: 'system',
  name: 'System',
  email: 'system@example.com',
});

export const isSystemMessage = (message: SentMessage): boolean => {
  return message.authorId === systemUser.id;
};

export const buildSystemMessage = ({
  content,
  roomId,
}: Omit<DraftMessage, 'authorId'>): DraftMessage => {
  return {
    content,
    roomId,
    authorId: systemUser.id,
  };
};
