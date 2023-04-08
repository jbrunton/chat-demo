import { CommandParser } from '../command.parser';
import { helpParser } from './help.parser';
import { loremParser } from './lorem.parser';
import { RenameRoomParser } from './rename.room.parser';
import { renameUserParser } from './rename.user.parser';

export const parsers: CommandParser[] = [
  helpParser,
  loremParser,
  RenameRoomParser,
  renameUserParser,
];
