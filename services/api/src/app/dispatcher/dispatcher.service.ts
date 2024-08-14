import { Dispatcher, DraftMessage, isPrivate } from '@entities/messages';
import { MessagesRepository } from '@entities/messages';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { AuthService, Role } from '@usecases/auth.service';
import { fromEvent, merge, Observable } from 'rxjs';
import { EventEmitter } from 'stream';

@Injectable()
export class DispatcherService extends Dispatcher {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly roomsRepository: RoomsRepository,
    private readonly authService: AuthService,
    private readonly emitter: EventEmitter,
    private readonly logger: ConsoleLogger,
  ) {
    super();
    logger.setContext(DispatcherService.name);
  }

  async subscribe(roomId: string, user: User): Promise<Observable<unknown>> {
    const room = await this.roomsRepository.getRoom(roomId);
    await this.authService.authorize({
      user,
      action: Role.Read,
      subject: room,
    });

    const publicMessages = fromEvent(
      this.emitter,
      publicMessageChannel(roomId),
    );
    const privateMessages = fromEvent(
      this.emitter,
      privateMessageChannel(roomId, user.id),
    );
    return merge(publicMessages, privateMessages);
  }

  async send(draft: DraftMessage) {
    const message = await this.messagesRepository.saveMessage(draft);

    const data = { message };
    const { roomId } = message;
    this.logger.log(`emitting event: ${JSON.stringify(message)}`);

    if (isPrivate(message)) {
      this.emitter.emit(privateMessageChannel(roomId, message.recipientId), {
        data,
      });
    } else {
      this.emitter.emit(publicMessageChannel(roomId), { data });
    }
  }
}

const publicMessageChannel = (roomId: string) => `/rooms/${roomId}`;
const privateMessageChannel = (roomId: string, userId: string) =>
  `/rooms/${roomId}/private/${userId}`;
