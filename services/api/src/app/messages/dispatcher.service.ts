import { AuthService, Role } from '@entities/auth';
import { isPrivate, Message } from '@entities/message.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { fromEvent, merge } from 'rxjs';
import { EventEmitter } from 'stream';

@Injectable()
export class DispatcherService {
  readonly emitter: EventEmitter;

  constructor(
    private readonly roomsRepository: RoomsRepository,
    private readonly authService: AuthService,
  ) {
    this.emitter = new EventEmitter();
  }

  async subscribe(roomId: string, user: User) {
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
