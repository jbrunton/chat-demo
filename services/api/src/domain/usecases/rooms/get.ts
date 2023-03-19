import { AuthService, Role } from '@entities/auth';
import { Room } from '@entities/room.entity';
import { RoomsRepository } from '@entities/rooms.repository';
import { User } from '@entities/user.entity';
import { Injectable } from '@nestjs/common';

export type RoomDetails = {
  room: Room;
  roles: Role[];
};

@Injectable()
export class GetRoomUseCase {
  constructor(
    private readonly rooms: RoomsRepository,
    private readonly authService: AuthService,
  ) {}

  async exec(roomId: string, user: User): Promise<RoomDetails> {
    const room = await this.rooms.getRoom(roomId);
    const roles = await this.authService.authorizedRoles({
      user,
      subject: room,
    });
    return { room, roles };
  }
}
