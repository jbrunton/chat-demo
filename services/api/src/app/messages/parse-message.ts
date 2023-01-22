import { Command } from '@entities/command.entity';
import { Draft, PublicMessage } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { CreateMessageDto } from 'src/app/messages/dto/create-message.dto';

export type ParsedMessage = Draft<PublicMessage> | Command;

export const isCommand = (message: ParsedMessage): message is Command => {
  return (message as Command).name !== undefined;
};

export const parseMessage = (
  { content, roomId }: CreateMessageDto,
  authenticatedUser: User,
): ParsedMessage => {
  if (content.startsWith('/')) {
    const args = content.slice(1).split(' ');
    const commandName = args[0];
    const command: Command = {
      roomId,
      name: commandName,
      args: args.slice(1),
    };

    //debug.messages("received command: %O", command);
    return command;
  }

  const message: ParsedMessage = {
    content,
    roomId,
    authorId: authenticatedUser.id,
  };

  //debug.messages("received message: %O", message);
  return message;
};
