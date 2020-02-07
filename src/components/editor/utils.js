import { Node } from 'slate';

export const DEFAULT_NODE = 'paragraph';
export const DEFAULT_PLAIN_NODE = 'line';

export const DEFAULT_VALUE = [
  {
    type: DEFAULT_NODE,
    children: [{ text: '' }],
  },
];

/*
 * Formatting constants for marks and blocks
 */
export const BOLD = 'bold';
export const ITALIC = 'italic';
export const UNDERLINE = 'underline';
export const CODE_SNIPPET = 'code-snippet';

export const LIST_ITEM = 'list-item';
export const CHECKLIST_ITEM = 'checklist-item';
export const NUMBERED_LIST = 'numbered-list';
export const BULLETED_LIST = 'bulleted-list';
export const CHECKLIST = 'checklist';
export const LIST_TYPES = [NUMBERED_LIST, BULLETED_LIST, CHECKLIST];

export const CODE_BLOCK = 'code-block';
export const BLOCK_QUOTE = 'block-quote';
export const WRAPPED_TYPES = [...LIST_TYPES, CODE_BLOCK, BLOCK_QUOTE];

export const LARGE_FONT = 'heading-one';
export const MEDIUM_FONT = 'heading-two';
export const SMALL_FONT = 'heading-three';

export const SECTION_BREAK = 'section-break';
export const VOID_TYPES = [SECTION_BREAK];

/*
 * Source constants for analytics tracking
 */
export const TOOLBAR_SOURCE = 'toolbar';
export const COMPOSITION_MENU_SOURCE = 'compositionMenu';
export const HOTKEY_SOURCE = 'hotkey';
export const MARKDOWN_SOURCE = 'markdown';
export const CUT_PASTE_SOURCE = 'cutAndPaste';

/*
 * Helper functions
 * SLATE UPGRADE TODO: move these into the custom Editor object for consistency?
 */
export const deserializedTitle = title => [
  {
    type: DEFAULT_NODE,
    children: [{ text: title }],
  },
];

export const toPlainText = children =>
  children.map(c => Node.string(c)).join('\n');
