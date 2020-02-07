import { isHotkey } from 'is-hotkey';

import {
  BOLD,
  ITALIC,
  UNDERLINE,
  CODE_SNIPPET,
  LARGE_FONT,
  MEDIUM_FONT,
  SMALL_FONT,
  HOTKEY_SOURCE,
  BULLETED_LIST,
  NUMBERED_LIST,
  CHECKLIST,
  CODE_BLOCK,
  BLOCK_QUOTE,
} from './utils';
import Editor from './Editor';

const MARK_HOTKEYS = {
  'mod+b': BOLD,
  'mod+i': ITALIC,
  'mod+u': UNDERLINE,
  'mod+shift+c': CODE_SNIPPET,
};

const BLOCK_HOTKEYS = {
  'mod+opt+1': LARGE_FONT,
  'mod+opt+2': MEDIUM_FONT,
  'mod+opt+3': SMALL_FONT,
  'mod+shift+7': NUMBERED_LIST,
  'mod+shift+8': BULLETED_LIST,
  'mod+shift+9': CHECKLIST,
  'mod+shift+k': CODE_BLOCK,
  'mod+shift+q': BLOCK_QUOTE,
};

export const triggerMarkHotkeys = (editor, event) => {
  Object.keys(MARK_HOTKEYS).forEach(hotkey => {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();
      const type = MARK_HOTKEYS[hotkey];
      Editor.toggleMark(editor, type, HOTKEY_SOURCE);
    }
  });
};

export const triggerBlockHotkeys = (editor, event) => {
  Object.keys(BLOCK_HOTKEYS).forEach(hotkey => {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();
      const type = BLOCK_HOTKEYS[hotkey];
      Editor.toggleBlock(editor, type, HOTKEY_SOURCE);
    }
  });
};
