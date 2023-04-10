export class Command {
  tokens: string[];
  roomId: string;
  canonicalInput: string;
}

export type ParsedCommand =
  | { tag: 'help'; params: null }
  | { tag: 'renameRoom'; params: { newName: string } }
  | { tag: 'renameUser'; params: { newName: string } }
  | {
      tag: 'lorem';
      params: { count: number; typeToken: 'words' | 'paragraphs' };
    };
