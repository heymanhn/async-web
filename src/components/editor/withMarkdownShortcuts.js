/*
 * Borrowed heavily from https://github.com/zbeyens/slate-plugins-next
 */
import { Range, Transforms } from 'slate';

import { LIST_TYPES, CHECKLIST } from './utils';
import Editor from './Editor';

const setNode = (editor, type) => {
  if (!LIST_TYPES.includes(type)) {
    Transforms.setNodes(
      editor,
      { type },
      { match: n => Editor.isBlock(editor, n) }
    );
  } else if (!Editor.isBlockActive(editor, type)) {
    Editor.toggleBlock(editor, type);
  }
};

const MARKDOWN_SHORTCUTS = [
  {
    trigger: 'space',
    before: /^(\[\])$/,
    change: editor => setNode(editor, CHECKLIST),
  },
  // '-': ListType.LIST_ITEM,
  // '+': ListType.LIST_ITEM,
  // '>': BLOCKQUOTE,
  // '#': HeadingType.H1,
  // '##': HeadingType.H2,
  // '###': HeadingType.H3,
  // '####': HeadingType.H4,
  // '#####': HeadingType.H5,
  // '######': HeadingType.H6,
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
      const block = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);

      const shortcutObj = shortcutForPattern(beforeText, text);
      if (shortcutObj) {
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
