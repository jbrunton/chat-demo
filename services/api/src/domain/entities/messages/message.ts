import { Observable } from 'rxjs';
import { User } from '../users/user';

export enum UpdatedEntity {
  Room = 'room',
  Users = 'users',
}

/**
 * A message that has been sent by a user and is stored in the system.
 */
export type SentMessage = {
  /**
   * Unique identifier for the message.
   */
  id: string;

  /**
   * The time the message was sent (in ms since the epoch).
   */
  time: number;

  /**
   * The text content of the message.
   */
  content: string;

  /**
   * The ID of the author of the message.
   */
  authorId: string;

  /**
   * The room the message was sent to.
   */
  roomId: string;

  /**
   * The recipient of the message.
   * If undefined, this is a public message sent to the room.
   * If specified, it is only shown to the recipient. Others in the room will not see or receive it.
   */
  recipientId?: string;

  /**
   * Some messages are sent in response to changes to the room (e.g. a room or user may have been
   * renamed). This field will include a list of the entities which were updated, so the client may
   * refresh its representation of these entities.
   */
  updatedEntities?: UpdatedEntity[];
};

/**
 * A refinement of the `Message` type to indicate it is private.
 */
export type PrivateMessage = SentMessage & {
  recipientId: string;
};

/**
 * Type guard to check if a message is private.
 * @param message The message to check
 * @returns `true` if the message is private
 */
export const isPrivate = (message: SentMessage): message is PrivateMessage => {
  return (message as PrivateMessage).recipientId !== undefined;
};

/**
 * Type for draft messages which have not yet been sent by the system.
 */
export type DraftMessage = Omit<SentMessage, 'id' | 'time'>;

/**
 * Abstract class for dispatching and subscribing to messages. All messages will be sent and
 * delivered to subscribers through a `Dispatcher`.
 */
export abstract class Dispatcher {
  abstract subscribe(roomId: string, user: User): Promise<Observable<unknown>>;
  abstract send(draft: DraftMessage): Promise<void>;
}
