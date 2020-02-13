import { Node } from 'slate';

export const DEFAULT_BLOCK_TYPE = 'paragraph';
export const DEFAULT_PLAIN_NODE = 'line';

export const DEFAULT_BLOCK = [
  {
    type: DEFAULT_BLOCK_TYPE,
    children: [{ text: '' }],
  },
];

/*
 * Formatting constants for marks and blocks
 */
export const BOLD = 'bold';
export const ITALIC = 'italic';
export const UNDERLINE = 'underline';
export const CODE_HIGHLIGHT = 'code-highlight';

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
 * Composition menu option titles
 */
export const TEXT_OPTION_TITLE = 'Text';
export const LARGE_TITLE_OPTION_TITLE = 'Large title';
export const MEDIUM_TITLE_OPTION_TITLE = 'Medium title';
export const BULLETED_LIST_OPTION_TITLE = 'Bulleted list';
export const NUMBERED_LIST_OPTION_TITLE = 'Numbered list';
export const CHECKLIST_OPTION_TITLE = 'Checklist';
export const CODE_BLOCK_OPTION_TITLE = 'Code block';
export const BLOCK_QUOTE_OPTION_TITLE = 'Quote';
export const SECTION_BREAK_OPTION_TITLE = 'Section break';

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
    type: DEFAULT_BLOCK_TYPE,
    children: [{ text: title }],
  },
];

export const toPlainText = children =>
  children.map(c => Node.string(c)).join('\n');
