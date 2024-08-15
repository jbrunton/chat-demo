import { SentMessage, DraftMessage } from './message';

export const systemUser = 'system';

export const isSystemMessage = (message: SentMessage): boolean => {
  return message.authorId === systemUser;
};

export const buildSystemMessage = ({
  content,
  roomId,
}: Omit<DraftMessage, 'authorId'>) => {
  return {
    content,
    roomId,
    authorId: systemUser,
  };
};
