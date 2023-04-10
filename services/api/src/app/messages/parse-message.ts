import { Command } from '@entities/command.entity';
import { Draft, PublicMessage } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { CreateMessageDto } from 'src/app/messages/dto/create-message.dto';

export type ParsedMessage = Draft<PublicMessage> | Command;

export const isCommand = (message: ParsedMessage): message is Command => {
  return (message as Command).tokens !== undefined;
};

export const parseMessage = (
  { content, roomId }: CreateMessageDto,
  authenticatedUser: User,
): ParsedMessage => {
  if (content.startsWith('/')) {
    const tokens = content.slice(1).split(' ');
    const canonicalInput = `/${tokens.join(' ')}`;

    const command: Command = {
      roomId,
      tokens,
      canonicalInput,
    };

    return command;
  }

  const message: ParsedMessage = {
    content,
    roomId,
    authorId: authenticatedUser.id,
  };

  return message;
};
