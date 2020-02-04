import { Node } from 'slate';

export const DEFAULT_NODE = 'paragraph';
export const DEFAULT_PLAIN_NODE = 'line';

export const DEFAULT_VALUE = [
  {
    type: DEFAULT_NODE,
    children: [{ text: '' }],
  },
];

export const TOOLBAR_SOURCE = 'toolbar';
export const COMPOSITION_MENU_SOURCE = 'compositionMenu';
export const HOTKEY_SOURCE = 'hotkey';
export const MARKDOWN_SOURCE = 'markdown';
export const CUT_PASTE_SOURCE = 'cutAndPaste';

export const deserializedTitle = title => [
  {
    type: DEFAULT_NODE,
    children: [{ text: title }],
  },
];

export const toPlainText = children =>
  children.map(c => Node.string(c)).join('\n');
