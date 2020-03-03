/*
 * Majority of these plugins borrowed from the Slate examples:
 * https://github.com/ianstormtaylor/slate/blob/master/site/examples/richtext.js
 */
import { Editor as SlateEditor, Range, Transforms } from 'slate';

import { track } from 'utils/analytics';

import {
  DEFAULT_ELEMENT,
  DEFAULT_ELEMENT_TYPE,
  LIST_TYPES,
  WRAPPED_TYPES,
  CHECKLIST,
  LIST_ITEM,
  CHECKLIST_ITEM,
  LARGE_FONT,
  MEDIUM_FONT,
  SMALL_FONT,
  INLINE_DISCUSSION_ANNOTATION,
  INLINE_DISCUSSION_SOURCE,
  HYPERLINK,
} from './utils';

/*
 * Queries
 */

const documentSelection = editor => ({
  anchor: SlateEditor.start(editor, []),
  focus: SlateEditor.end(editor, []),
});

const isElementActive = (editor, type, range) => {
  const [match] = SlateEditor.nodes(editor, {
    at: range || undefined,
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

const isEmptyContent = editor => {
  const { children } = editor;
  return children.length === 1 && SlateEditor.isEmpty(editor, children[0]);
};

const isEmptyElement = (editor, type) => {
  const { selection } = editor;
  if (!selection || Range.isExpanded(selection)) return false;

  const [block] = getParentBlock(editor);
  return block.type === type && SlateEditor.isEmpty(editor, block);
};

const isEmptyParagraph = editor => isEmptyElement(editor, DEFAULT_ELEMENT_TYPE);

const isEmptyListItem = editor =>
  isEmptyElement(editor, LIST_ITEM) || isEmptyElement(editor, CHECKLIST_ITEM);

// Paragraph node, not wrapped by anything
const isDefaultBlock = editor =>
  !isWrappedBlock(editor) && isElementActive(editor, DEFAULT_ELEMENT_TYPE);

const isHeadingBlock = editor => {
  return (
    isElementActive(editor, LARGE_FONT) ||
    isElementActive(editor, MEDIUM_FONT) ||
    isElementActive(editor, SMALL_FONT)
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

  const [, path] = getParentBlock(editor, selection);
  const { anchor } = selection;
  return callback(editor, anchor, path);
};

const isAtBeginning = editor => isAtEdge(editor, SlateEditor.isStart);

const isAtEnd = editor => isAtEdge(editor, SlateEditor.isEnd);

const isEmptyNodeInWrappedBlock = editor =>
  isWrappedBlock(editor) &&
  (isEmptyParagraph(editor) || isEmptyListItem(editor));

const findNodeByType = (editor, type) => {
  return SlateEditor.nodes(editor, {
    at: documentSelection(editor),
    match: n => n.type === type,
  }).next().value;
};

/*
 * Transforms
 */

const toggleBlock = (editor, type, source) => {
  const isActive = isElementActive(editor, type);
  const isList = LIST_TYPES.includes(type);
  const isWrapped = WRAPPED_TYPES.includes(type);

  Transforms.unwrapNodes(editor, {
    match: n => WRAPPED_TYPES.includes(n.type),
    split: true,
  });

  // Normal toggling is sufficient for this case
  if (!isWrapped) {
    Transforms.setNodes(editor, {
      type: isActive ? DEFAULT_ELEMENT_TYPE : type,
    });
  }

  // Special treatment for lists: set leaf nodes to list item or checklist item
  if (isList) {
    const isChecklist = type === CHECKLIST;
    const listItemType = isChecklist ? CHECKLIST_ITEM : LIST_ITEM;
    const payload = {
      type: isActive ? DEFAULT_ELEMENT_TYPE : listItemType,
    };
    if (isChecklist) payload.isChecked = false;

    Transforms.setNodes(editor, payload);
  }

  if (!isActive && isWrapped) {
    Transforms.wrapNodes(editor, { type, children: [] });
  }

  // We're not interested in tracking text blocks...
  if (!isActive && type !== DEFAULT_ELEMENT_TYPE) {
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

const removeAllMarks = editor => {
  const marks = SlateEditor.marks(editor);
  const markTypes = Object.keys(marks);

  markTypes.forEach(type => SlateEditor.removeMark(editor, type));
};

const wrapInline = (editor, type, range, source, props = {}) => {
  const isActive = isElementActive(editor, type, range);
  const options = {};
  if (range) {
    options.at = range;
    options.split = true;
  }

  Transforms.wrapNodes(
    editor,
    {
      type: isActive ? DEFAULT_ELEMENT_TYPE : type,
      ...props,
    },
    options
  );

  if (!isActive) {
    track('Inline element inserted to content', { source, type });
  }
};

const insertVoid = (editor, type, data = {}) => {
  Transforms.setNodes(editor, { type, ...data, children: [] });
  Transforms.insertNodes(editor, DEFAULT_ELEMENT);
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

const wrapInlineAnnotation = (editor, discussionId, selection) => {
  wrapInline(
    editor,
    INLINE_DISCUSSION_ANNOTATION,
    selection,
    INLINE_DISCUSSION_SOURCE,
    { discussionId }
  );
};

const removeInlineAnnotation = (editor, discussionId) => {
  Transforms.unwrapNodes(editor, {
    at: documentSelection(editor),
    match: n =>
      n.type === INLINE_DISCUSSION_ANNOTATION &&
      n.discussionId === discussionId,
    split: true,
  });
};

// Credit to https://github.com/ianstormtaylor/slate/blob/master/site/examples/links.js
const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.type === HYPERLINK });
};

// Credit to https://github.com/ianstormtaylor/slate/blob/master/site/examples/links.js
const wrapLink = (editor, url) => {
  if (isElementActive(editor, HYPERLINK)) unwrapLink(editor);

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: HYPERLINK,
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const Editor = {
  ...SlateEditor,

  // Queries (no transforms)
  documentSelection,
  isElementActive,
  isMarkActive,
  isWrappedBlock,
  isEmptyContent,
  isEmptyElement,
  isEmptyParagraph,
  isEmptyListItem,
  isDefaultBlock,
  isHeadingBlock,
  isSlashCommand,
  isAtBeginning,
  isAtEnd,
  isEmptyNodeInWrappedBlock,
  getParentBlock,
  getCurrentNode,
  getCurrentText,
  findNodeByType,

  // Transforms
  toggleBlock,
  toggleMark,
  removeAllMarks,
  wrapInline,
  insertVoid,
  clearBlock,
  replaceBlock,
  wrapInlineAnnotation,
  removeInlineAnnotation,
  wrapLink,
  unwrapLink,
};

export default Editor;
