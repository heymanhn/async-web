/*
 * Borrowed heavily from https://github.com/zbeyens/slate-plugins-next
 */
import { Range, Transforms } from 'slate';

import {
  MARKDOWN_SOURCE,
  WRAPPED_TYPES,
  BULLETED_LIST,
  CHECKLIST,
  BLOCK_QUOTE,
  CODE_BLOCK,
  LARGE_FONT,
  MEDIUM_FONT,
  SMALL_FONT,
  SECTION_BREAK,
} from './utils';
import Editor from './Editor';

const setNode = (editor, type) => {
  if (!WRAPPED_TYPES.includes(type)) {
    Transforms.setNodes(
      editor,
      { type },
      { match: n => Editor.isBlock(editor, n) }
    );
  } else if (!Editor.isBlockActive(editor, type)) {
    Editor.toggleBlock(editor, type, MARKDOWN_SOURCE);
  }
};

const MARKDOWN_SHORTCUTS = [
  {
    trigger: 'space',
    before: /^(\[\])$/,
    change: editor => setNode(editor, CHECKLIST),
  },
  {
    trigger: 'space',
    before: /^(-)$/,
    change: editor => setNode(editor, BULLETED_LIST),
  },
  {
    trigger: 'space',
    before: /^(\*)$/,
    change: editor => setNode(editor, BULLETED_LIST),
  },
  {
    trigger: 'space',
    before: /^(\+)$/,
    change: editor => setNode(editor, BULLETED_LIST),
  },
  {
    trigger: 'space',
    before: /^(>)$/,
    change: editor => setNode(editor, BLOCK_QUOTE),
  },
  {
    trigger: '`',
    before: /^(``)$/,
    change: editor => setNode(editor, CODE_BLOCK),
  },
  {
    trigger: 'space',
    before: /^(#)$/,
    change: editor => setNode(editor, LARGE_FONT),
  },
  {
    trigger: 'space',
    before: /^(##)$/,
    change: editor => setNode(editor, MEDIUM_FONT),
  },
  {
    trigger: 'space',
    before: /^(###)$/,
    change: editor => setNode(editor, SMALL_FONT),
  },
  {
    trigger: 'space',
    before: /(--)$/,
    change: editor => editor.insertText('— '),
  },
  {
    trigger: '-',
    before: /^(--)$/,
    change: editor => Editor.insertVoid(editor, SECTION_BREAK),
  },
];

const triggerString = trigger => (trigger === 'space' ? ' ' : trigger);
const isTriggered = text => {
  const triggers = [...new Set(MARKDOWN_SHORTCUTS.map(s => s.trigger))];
  return !!triggers.find(t => triggerString(t) === text);
};

/*
 * Need to make sure both the trigger sequence AND the markdown matches
 * a shortcut entry.
 */
const shortcutForPattern = (pattern, text) =>
  MARKDOWN_SHORTCUTS.find(s => {
    const { trigger, before } = s;
    return triggerString(trigger) === text && pattern.match(before);
  });

const withMarkdownShortcuts = oldEditor => {
  const editor = oldEditor;
  const { insertText } = editor;

  editor.insertText = text => {
    const { selection } = editor;

    if (isTriggered(text) && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.getParentBlock(editor);
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);

      // Our rule: markdown shortcuts don't work when text is inside a block
      // that's wrapped by another block already
      const shortcutObj = shortcutForPattern(beforeText, text);
      if (shortcutObj && !Editor.isWrappedBlock(editor)) {
        Transforms.select(editor, range);
        Transforms.delete(editor);
        shortcutObj.change(editor);

        return;
      }
    }

    insertText(text);
  };

  return editor;
};

export default withMarkdownShortcuts;
