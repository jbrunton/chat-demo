import { Draft, PrivateMessage } from '@entities/message.entity';
import { User } from '@entities/user.entity';

const helpContent = `
<p>Type to chat, or enter one of the following commands:</p>
<b>/help</b>: list commands<br />
<b>/rename user &lt;name&gt;</b>: change your display name<br />
<b>/rename room &lt;name&gt;</b>: change the room name<br />
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
