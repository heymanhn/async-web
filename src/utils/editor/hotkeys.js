import { isHotkey } from 'is-hotkey';
import { Transforms } from 'slate';

import {
  BOLD,
  ITALIC,
  UNDERLINE,
  CODE_HIGHLIGHT,
  LARGE_FONT,
  MEDIUM_FONT,
  SMALL_FONT,
  HOTKEY_SOURCE,
  BULLETED_LIST,
  NUMBERED_LIST,
  CHECKLIST,
  CODE_BLOCK,
  BLOCK_QUOTE,
} from 'utils/editor/constants';

import Editor from 'components/editor/Editor';

const MARK_HOTKEYS = {
  'mod+b': BOLD,
  'mod+i': ITALIC,
  'mod+u': UNDERLINE,
  'mod+shift+c': CODE_HIGHLIGHT,
};

const BLOCK_HOTKEYS = {
  'mod+opt+1': LARGE_FONT,
  'mod+opt+2': MEDIUM_FONT,
  'mod+opt+3': SMALL_FONT,
  'mod+shift+7': NUMBERED_LIST,
  'mod+shift+8': BULLETED_LIST,
  'mod+shift+9': CHECKLIST,
  'mod+shift+k': CODE_BLOCK,
  'mod+shift+>': BLOCK_QUOTE,
};

const SOFT_BREAK_HOTKEY = 'shift+enter';
const RIGHT_ARROW_HOTKEY = 'right';

const INDENT_LIST_ITEM_HOTKEY = 'tab';
const OUTDENT_LIST_ITEM_HOTKEY = 'shift+tab';

const markHotkeys = (editor, event) => {
  Object.keys(MARK_HOTKEYS).forEach(hotkey => {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();
      const type = MARK_HOTKEYS[hotkey];

      if (
        type === CODE_HIGHLIGHT &&
        Editor.isMarkActive(editor, CODE_HIGHLIGHT) &&
        Editor.isAtEnd(editor)
      ) {
        Transforms.insertNodes(editor, { text: ' ' });
      } else {
        Editor.toggleMark(editor, type, HOTKEY_SOURCE);
      }
    }
  });
};

const blockHotkeys = (editor, event) => {
  Object.keys(BLOCK_HOTKEYS).forEach(hotkey => {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();
      const type = BLOCK_HOTKEYS[hotkey];
      Editor.toggleBlock(editor, type, HOTKEY_SOURCE);
    }
  });
};

const softBreak = (editor, event) => {
  if (isHotkey(SOFT_BREAK_HOTKEY, event)) {
    event.preventDefault();
    Editor.insertText(editor, '\n');
  }
};

const exitCodeHighlight = (editor, event) => {
  if (
    isHotkey(RIGHT_ARROW_HOTKEY, event) &&
    Editor.isMarkActive(editor, CODE_HIGHLIGHT) &&
    Editor.isAtEnd(editor)
  ) {
    event.preventDefault();
    Transforms.insertNodes(editor, { text: ' ' });
  }
};

const nestedListHotkeys = (editor, event) => {
  if (
    Editor.isInListBlock(editor) &&
    !Editor.isNumberedList(editor) &&
    Editor.isAtBeginning(editor)
  ) {
    if (isHotkey(INDENT_LIST_ITEM_HOTKEY, event)) {
      event.preventDefault();
      Editor.indentListItem(editor);
    }

    if (isHotkey(OUTDENT_LIST_ITEM_HOTKEY, event)) {
      event.preventDefault();
      Editor.outdentListItem(editor);
    }
  }
};

export {
  markHotkeys,
  blockHotkeys,
  softBreak,
  exitCodeHighlight,
  nestedListHotkeys,
};
