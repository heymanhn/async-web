/* eslint import/prefer-default-export: 0 */
/* eslint no-nested-ternary: 0 */

/*
 * Majority of these plugins borrowed from the Slate examples:
 * https://github.com/ianstormtaylor/slate/blob/master/site/examples/richtext.js
 */
import { Editor as SlateEditor, Range, Transforms } from 'slate';

import { track } from 'utils/analytics';

import {
  DEFAULT_VALUE,
  DEFAULT_NODE,
  LIST_TYPES,
  WRAPPED_TYPES,
  CHECKLIST,
  LIST_ITEM,
  CHECKLIST_ITEM,
  LARGE_FONT,
  MEDIUM_FONT,
  SMALL_FONT,
} from './utils';

/*
 * Queries
 */

const isBlockActive = (editor, type) => {
  const [match] = SlateEditor.nodes(editor, {
    match: n => n.type === type,
  });

  return !!match;
};

const isMarkActive = (editor, type) => {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[type] === true : false;
};

const isWrappedBlock = editor => {
  const [match] = SlateEditor.nodes(editor, {
    match: n => WRAPPED_TYPES.includes(n.type),
  });

  return !!match;
};

const getParentBlock = editor => {
  return SlateEditor.above(editor, {
    match: n => SlateEditor.isBlock(editor, n),
  });
};

const getCurrentNode = editor => {
  const { selection } = editor;
  if (!selection || Range.isExpanded(selection))
    throw new Error('Selection is invalid');

  const node = SlateEditor.node(editor, selection);
  return node;
};

const getCurrentText = editor => {
  const { selection } = editor;
  const [, path] = SlateEditor.node(editor, selection);
  return SlateEditor.string(editor, path);
};

const isEmptyParagraph = editor => {
  const { selection } = editor;
  if (!selection || Range.isExpanded(selection)) return false;

  const [block] = getParentBlock(editor);
  return block.type === DEFAULT_NODE && SlateEditor.isEmpty(editor, block);
};

// Paragraph node, not wrapped by anything
const isDefaultBlock = editor =>
  !isWrappedBlock(editor) && isBlockActive(editor, DEFAULT_NODE);

const isHeadingBlock = editor => {
  return (
    isBlockActive(editor, LARGE_FONT) ||
    isBlockActive(editor, MEDIUM_FONT) ||
    isBlockActive(editor, SMALL_FONT)
  );
};

// The cursor must be after the slash
const isSlashCommand = editor => {
  const { selection } = editor;
  if (!selection || Range.isExpanded(selection)) return false;

  const { anchor } = selection;
  const [, path] = SlateEditor.node(editor, selection);
  const contents = SlateEditor.string(editor, path);
  return isDefaultBlock(editor) && contents === '/' && anchor.offset === 1;
};

const isAtEdge = (editor, callback) => {
  const { selection } = editor;
  if (!selection || Range.isExpanded(selection)) return false;

  const { anchor } = selection;
  const [, path] = SlateEditor.node(editor, selection);
  return callback(editor, anchor, path);
};

const isAtBeginning = editor => {
  return isAtEdge(editor, SlateEditor.isStart);
};

const isAtEnd = editor => {
  return isAtEdge(editor, SlateEditor.isEnd);
};

/*
 * Transforms
 */

const toggleBlock = (editor, type, source) => {
  const isActive = isBlockActive(editor, type);
  const isList = LIST_TYPES.includes(type);
  const isWrapped = WRAPPED_TYPES.includes(type);

  Transforms.unwrapNodes(editor, {
    match: n => WRAPPED_TYPES.includes(n.type),
    split: true,
  });

  // Normal toggling is sufficient for this case
  if (!isWrapped) {
    Transforms.setNodes(editor, { type: isActive ? DEFAULT_NODE : type });
  }

  // Special treatment for lists: set leaf nodes to list item or checklist item
  if (isList) {
    const isChecklist = type === CHECKLIST;
    const listItemType = isChecklist ? CHECKLIST_ITEM : LIST_ITEM;
    const payload = {
      type: isActive ? DEFAULT_NODE : listItemType,
    };
    if (isChecklist) payload.isChecked = false;

    Transforms.setNodes(editor, payload);
  }

  if (!isActive && isWrapped) {
    Transforms.wrapNodes(editor, { type, children: [] });
  }

  // We're not interested in tracking text blocks...
  if (!isActive && type !== DEFAULT_NODE) {
    track('Block inserted to content', { type, source });
  }
};

const toggleMark = (editor, type, source) => {
  const isActive = isMarkActive(editor, type);

  if (isActive) {
    SlateEditor.removeMark(editor, type);
  } else {
    SlateEditor.addMark(editor, type, true);
    track('Mark added to content', { type, source });
  }
};

const insertVoid = (editor, type, data = {}) => {
  Transforms.setNodes(editor, { type, ...data, children: [] });
  Transforms.insertNodes(editor, DEFAULT_VALUE);
};

const clearBlock = editor => {
  const { selection } = editor;
  const [block] = getParentBlock(editor, selection);

  if (!SlateEditor.isEmpty(editor, block))
    SlateEditor.deleteBackward(editor, { unit: 'block' });
};

const replaceBlock = (editor, type, source) => {
  clearBlock(editor);
  return toggleBlock(editor, type, source);
};

const Editor = {
  ...SlateEditor,

  // Queries (no transforms)
  isBlockActive,
  isMarkActive,
  isWrappedBlock,
  isEmptyParagraph,
  isDefaultBlock,
  isHeadingBlock,
  isSlashCommand,
  isAtBeginning,
  isAtEnd,
  getParentBlock,
  getCurrentNode,
  getCurrentText,

  // Transforms
  toggleBlock,
  toggleMark,
  insertVoid,
  clearBlock,
  replaceBlock,
};

export default Editor;
