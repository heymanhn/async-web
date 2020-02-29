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
  CODE_HIGHLIGHT,
  NUMBERED_LIST,
} from './utils';
import Editor from './Editor';

const setNode = (editor, type) => {
  if (!WRAPPED_TYPES.includes(type)) {
    Transforms.setNodes(
      editor,
      { type },
      { match: n => Editor.isBlock(editor, n) }
    );
  } else if (!Editor.isElementActive(editor, type)) {
    Editor.toggleBlock(editor, type, MARKDOWN_SOURCE);
  }
};

const setCodeHighlight = (editor, matchingText) => {
  const text = matchingText.substring(1);
  const codeHighlightNode = { text };
  codeHighlightNode[CODE_HIGHLIGHT] = true;

  Transforms.insertNodes(editor, [codeHighlightNode]);
  Transforms.insertNodes(editor, { text: ' ' });
};

const MARKDOWN_SHORTCUTS = [
  {
    trigger: 'space',
    before: /^(\[\])$/,
    when: editor => !Editor.isWrappedBlock(editor),
    change: editor => setNode(editor, CHECKLIST),
  },
  {
    trigger: 'space',
    before: /^(-)$/,
    when: editor => !Editor.isWrappedBlock(editor),
    change: editor => setNode(editor, BULLETED_LIST),
  },
  {
    trigger: 'space',
    before: /^(\d.)$/,
    when: editor => !Editor.isWrappedBlock(editor),
    change: editor => setNode(editor, NUMBERED_LIST),
  },
  {
    trigger: 'space',
    before: /^(\*)$/,
    when: editor => !Editor.isWrappedBlock(editor),
    change: editor => setNode(editor, BULLETED_LIST),
  },
  {
    trigger: 'space',
    before: /^(\+)$/,
    when: editor => !Editor.isWrappedBlock(editor),
    change: editor => setNode(editor, BULLETED_LIST),
  },
  {
    trigger: 'space',
    before: /^(>)$/,
    when: editor => !Editor.isWrappedBlock(editor),
    change: editor => setNode(editor, BLOCK_QUOTE),
  },
  {
    trigger: '`',
    before: /`[^`]+$/,
    when: editor =>
      !Editor.isElementActive(editor, CODE_BLOCK) &&
      !Editor.isElementActive(editor, BLOCK_QUOTE),
    change: (...args) => setCodeHighlight(...args),
  },
  {
    trigger: '`',
    before: /^(``)$/,
    when: editor => !Editor.isWrappedBlock(editor),
    change: editor => setNode(editor, CODE_BLOCK),
  },
  {
    trigger: 'space',
    before: /^(#)$/,
    when: editor => !Editor.isWrappedBlock(editor),
    change: editor => setNode(editor, LARGE_FONT),
  },
  {
    trigger: 'space',
    before: /^(##)$/,
    when: editor => !Editor.isWrappedBlock(editor),
    change: editor => setNode(editor, MEDIUM_FONT),
  },
  {
    trigger: 'space',
    before: /^(###)$/,
    when: editor => !Editor.isWrappedBlock(editor),
    change: editor => setNode(editor, SMALL_FONT),
  },
  {
    trigger: 'space',
    before: /(--)$/,
    when: () => true,
    change: editor => editor.insertText('— '),
  },
  {
    trigger: '-',
    before: /^(--)$/,
    when: editor => !Editor.isWrappedBlock(editor),
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
const shortcutForPattern = (pattern, text) => {
  const shortcutObj = MARKDOWN_SHORTCUTS.find(s => {
    const { trigger, before } = s;
    return triggerString(trigger) === text && pattern.match(before);
  });

  return !shortcutObj
    ? [false]
    : [shortcutObj, ...pattern.match(shortcutObj.before)];
};

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

      const [shortcutObj, matchingText] = shortcutForPattern(beforeText, text);
      if (shortcutObj && shortcutObj.when(editor)) {
        Transforms.collapse(editor, { edge: 'focus' });
        Transforms.move(editor, {
          edge: 'anchor',
          distance: matchingText.length,
          reverse: true,
          unit: 'offset',
        });
        Transforms.delete(editor);
        shortcutObj.change(editor, matchingText);

        return;
      }
    }

    insertText(text);
  };

  return editor;
};

export default withMarkdownShortcuts;
