import { Draft, PrivateMessage } from '@entities/message.entity';
import { User } from '@entities/user.entity';

const helpContent = `
Type to chat, or enter one of the following commands:

\`/help\`: list commands
\`/rename user {name}\`: change your display name
\`/rename room {name}\`: change the room name
\`/lorem {count} {'words' | 'paragraphs'}\`: generate lorem text
`;

export type HelpParams = {
  authenticatedUser: User;
  roomId: string;
};

export const helpResponse = (params: HelpParams): Draft<PrivateMessage> => {
  const { roomId, authenticatedUser } = params;
  return {
    content: helpContent,
    recipientId: authenticatedUser.id,
    roomId,
    authorId: 'system',
  };
};
