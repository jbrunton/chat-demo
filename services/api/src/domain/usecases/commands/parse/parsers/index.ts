import { CommandParser } from '../command.parser';
import { changeRoomJoinPolicyParser } from './change-room-join-policy-parser';
import { helpParser } from './help.parser';
import { inviteParser } from './invite-parser';
import { leaveParser } from './leave.parser';
import { loremParser } from './lorem.parser';
import { renameRoomParser } from './rename.room.parser';
import { renameUserParser } from './rename.user.parser';

export const parsers: CommandParser[] = [
  helpParser,
  loremParser,
  renameRoomParser,
  renameUserParser,
  leaveParser,
  changeRoomJoinPolicyParser,
  inviteParser,
];
