import { SentMessage, DraftMessage } from '../messages/message';

export const systemUser = Object.freeze({
  id: 'system',
  name: 'System',
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
