import { CommandParser } from '../command.parser';
import { aboutRoomParser } from './about-room-parser';
import { approveRequestParser } from './approve-request-parser';
import { setRoomJoinPolicyParser } from './set-room-join-policy-parser';
import { helpParser } from './help.parser';
import { inviteParser } from './invite-parser';
import { leaveParser } from './leave.parser';
import { loremParser } from './lorem.parser';
import { renameRoomParser } from './rename.room.parser';
import { renameUserParser } from './rename.user.parser';
import { setRoomContentPolicyParser } from './set-room-content-policy-parser';

export const parsers: CommandParser[] = [
  helpParser,
  loremParser,
  renameRoomParser,
  renameUserParser,
  leaveParser,
  setRoomJoinPolicyParser,
  setRoomContentPolicyParser,
  aboutRoomParser,
  inviteParser,
  approveRequestParser,
];
