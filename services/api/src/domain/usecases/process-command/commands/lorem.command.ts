import { Dispatcher, DraftMessage } from '@entities/message.entity';
import { MessagesRepository } from '@entities/messages.repository';
import { User } from '@entities/user.entity';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

type LoremType = 'words' | 'paragraphs';

export type LoremParams = {
  roomId: string;
  authenticatedUser: User;
  countToken?: string;
  typeToken?: string;
};

@Injectable()
export class LoremCommandUseCase {
  constructor(
    private readonly messages: MessagesRepository,
    private readonly dispatcher: Dispatcher,
  ) {}

  async exec(params: LoremParams): Promise<void> {
    const draft = await this.getResponse(params);
    const message = await this.messages.saveMessage(draft);
    this.dispatcher.emit(message);
  }

  private async getResponse(params: LoremParams): Promise<DraftMessage> {
    const authorId = 'system';
    const { roomId, authenticatedUser, countToken, typeToken } = params;
    if (!countToken || !typeToken) {
      const content =
        "Missing params. Required: <code>lorem [count] ['words' | 'paragraphs']</code>";
      return { content, roomId, recipientId: authenticatedUser.id, authorId };
    }

    const count = Number(countToken);
    if (count <= 0 || count > 20) {
      const content = '`count` must be between 1 and 20';
      return { content, roomId, recipientId: authenticatedUser.id, authorId };
    }

    if (!['words', 'paragraphs'].includes(typeToken)) {
      const content = '`type` must be `words` or `paragraphs`';
      return { content, roomId, recipientId: authenticatedUser.id, authorId };
    }

    const loremType = typeToken as LoremType;
    const content = faker.lorem[loremType](count);
    return {
      content,
      roomId,
      authorId: 'system',
    };
  }
}
