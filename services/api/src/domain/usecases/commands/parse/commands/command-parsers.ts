import { Command } from '../parsed-command';
import { aboutRoomCommand } from './about-room-command';
import { approveRequestCommand } from './approve-request-command';
import { setRoomJoinPolicyCommand } from './set-room-join-policy-command';
import { helpCommand } from './help-command';
import { inviteCommand } from './invite-command';
import { leaveCommand } from './leave-command';
import { loremCommand } from './lorem-command';
import { renameRoomCommand } from './rename-room-command';
import { renameUserCommand } from './rename-user-command';
import { setRoomContentPolicyCommand } from './set-room-content-policy-command';

export const commands: Command[] = [
  helpCommand,
  loremCommand,
  renameRoomCommand,
  renameUserCommand,
  leaveCommand,
  setRoomJoinPolicyCommand,
  setRoomContentPolicyCommand,
  aboutRoomCommand,
  inviteCommand,
  approveRequestCommand,
];
