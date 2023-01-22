import { DraftMessage, Message } from '@entities/message.entity';
import { Room } from '@entities/room.entitiy';
import { User } from '@entities/user.entity';
import { AuthInfo } from '@lib/auth/identity/auth-info';

export type SaveUserParams = AuthInfo & {
  name: string;
};

export type SaveMessageParams = DraftMessage & { time: number };

export type CreateRoomParams = Omit<Room, 'id'>;

export abstract class DBAdapter {
  abstract tableName: string;

  abstract create(): Promise<void>;
  abstract destroy(): Promise<void>;

  abstract saveUser(params: SaveUserParams): Promise<User>;
  abstract getUser(id: string): Promise<User>;

  abstract saveMessage(params: SaveMessageParams): Promise<Message>;
  abstract getMessagesForRoom(roomId: string): Promise<Message[]>;

  abstract createRoom(params: CreateRoomParams): Promise<Room>;
  abstract getRoom(id: string): Promise<Room>;
}
