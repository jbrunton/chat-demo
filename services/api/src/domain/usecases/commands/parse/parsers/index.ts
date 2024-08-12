import { CommandParser } from '../command.parser';
import { helpParser } from './help.parser';
import { loremParser } from './lorem.parser';
import { renameRoomParser } from './rename.room.parser';
import { renameUserParser } from './rename.user.parser';

export const parsers: CommandParser[] = [
  helpParser,
  loremParser,
  renameRoomParser,
  renameUserParser,
];
