import { Dispatcher, DraftMessage } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';

export type LoremType = 'words' | 'paragraphs';

export type LoremParams = {
  roomId: string;
  authenticatedUser: User;
  count: number;
  typeToken: LoremType;
};

export type LoremGeneratorParams = Pick<LoremParams, 'count' | 'typeToken'>;

export abstract class LoremGenerator {
  abstract generate(params: LoremGeneratorParams): string;
}

@Injectable()
export class LoremCommandUseCase {
  constructor(
    private readonly dispatcher: Dispatcher,
    private readonly loremGenerator: LoremGenerator,
  ) {}

  async exec(params: LoremParams): Promise<void> {
    const draft = await this.getResponse(params);
    await this.dispatcher.send(draft);
  }

  private async getResponse(params: LoremParams): Promise<DraftMessage> {
    const authorId = 'system';
    const { roomId, authenticatedUser, count } = params;

    if (count <= 0 || count > 20) {
      const content = '`count` must be between 1 and 20';
      return { content, roomId, recipientId: authenticatedUser.id, authorId };
    }

    const content = this.loremGenerator.generate(params);
    return {
      content,
      roomId,
      authorId: 'system',
    };
  }
}
