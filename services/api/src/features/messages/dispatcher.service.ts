import { Message } from '@entities/message.entity';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';
import { fromEvent } from 'rxjs';
import { EventEmitter } from 'stream';

@Injectable()
export class DispatcherService {
  readonly emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  subscribe(roomId: string) {
    return fromEvent(this.emitter, `/rooms/${roomId}`);
  }

  emit(message: Message, author: User) {
    this.emitter.emit(`/rooms/${message.roomId}`, {
      data: {
        message,
        author,
      },
    });
  }
}
