import { isPrivate, Message } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { AuthInfo } from '@entities/auth-info';
import { Injectable } from '@nestjs/common';
import { fromEvent, merge } from 'rxjs';
import { EventEmitter } from 'stream';

@Injectable()
export class DispatcherService {
  readonly emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  subscribe(roomId: string, auth: AuthInfo) {
    const publicMessages = fromEvent(
      this.emitter,
      publicMessageChannel(roomId),
    );
    const privateMessages = fromEvent(
      this.emitter,
      privateMessageChannel(roomId, `user:${auth.sub}`),
    );
    return merge(publicMessages, privateMessages);
  }

  emit(message: Message, author: User) {
    const data = { message, author };
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
