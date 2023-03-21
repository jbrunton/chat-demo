import { AuthService, Role } from '@entities/auth';
import { Dispatcher, isPrivate, Message } from '@entities/message.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { fromEvent, merge, Observable } from 'rxjs';
import { EventEmitter } from 'stream';

@Injectable()
export class DispatcherService extends Dispatcher {
  readonly emitter: EventEmitter;

  private readonly logger = new Logger(DispatcherService.name);

  constructor(
    private readonly roomsRepository: RoomsRepository,
    private readonly authService: AuthService,
  ) {
    super();
    this.emitter = new EventEmitter();
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

  emit(message: Message) {
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
