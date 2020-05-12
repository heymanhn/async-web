/*
 * Majority of these plugins borrowed from the Slate examples:
 * https://github.com/ianstormtaylor/slate/blob/master/site/examples/richtext.js
 */
import { Editor, Point, Range, Text, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { track } from 'utils/analytics';
import {
  DEFAULT_ELEMENT,
  DEFAULT_ELEMENT_TYPE,
  LIST_TYPES,
  WRAPPED_TYPES,
  NUMBERED_LIST,
  CHECKLIST,
  LIST_ITEM,
  BULLETED_LIST_ITEM,
  NUMBERED_LIST_ITEM,
  CHECKLIST_ITEM,
  MAX_LIST_ITEM_DEPTH,
  LARGE_FONT,
  MEDIUM_FONT,
  SMALL_FONT,
  CONTEXT_HIGHLIGHT,
  INLINE_THREAD_ANNOTATION,
  INLINE_DISCUSSION_SOURCE,
  HYPERLINK,
  IMAGE,
  SECTION_BREAK,
  BLOCK_QUOTE,
} from 'utils/editor/constants';

/*
 * Queries
 */

const documentSelection = editor => Editor.range(editor, []);

const isElementActive = (editor, type, range) => {
  const [match] = Editor.nodes(editor, {
    at: range || undefined,
    match: n => n.type === type,
  });

  return !!match;
};

const isMarkActive = (editor, type) => {
  const marks = Editor.marks(editor);
  return marks ? marks[type] === true : false;
};

const isWrappedBlock = (editor, at) => {
  const [match] = Editor.nodes(editor, {
    at,
    match: n => WRAPPED_TYPES.includes(n.type),
  });

  return !!match;
};

const isInListBlock = (editor, at) => {
  const [match] = Editor.nodes(editor, {
    at,
    match: n => LIST_TYPES.includes(n.type),
  });

  return !!match;
};

const isNumberedList = (editor, at) => {
  const [match] = Editor.nodes(editor, {
    at,
    match: n => n.type === NUMBERED_LIST,
  });

  return !!match;
};

const getParentBlock = (editor, mode = 'lowest') => {
  return Editor.above(editor, {
    match: n => Editor.isBlock(editor, n),
    mode,
  });
};

const getCurrentText = editor => {
  const { selection } = editor;
  const [, path] = Editor.node(editor, selection);
  return Editor.string(editor, path);
};

/*
 * Equivalent to Editor.isEmpty(), but trims whitespace from text node
 */
const isEmptyText = (editor, element) => {
  const { children } = element;
  const [first] = children;
  return (
    children.length === 0 ||
    (children.length === 1 &&
      Text.isText(first) &&
      first.text.trim() === '' &&
      !editor.isVoid(element))
  );
};

/*
 * Checks all the top-level children of the content. Returns true once one
 * of the top-level children is non-empty.
 */
const isEmptyContent = editor => {
  const { children } = editor;
  for (let i = 0; i < children.length; i += 1) {
    if (!isEmptyText(editor, children[i])) return false;
  }

  return true;
};

const isEmptyElement = (editor, type) => {
  const { selection } = editor;
  if (!selection || Range.isExpanded(selection)) return false;

  const [block] = getParentBlock(editor);
  return block.type === type && Editor.isEmpty(editor, block);
};

const isEmptyParagraph = editor => isEmptyElement(editor, DEFAULT_ELEMENT_TYPE);

const isEmptyListItem = editor =>
  isEmptyElement(editor, LIST_ITEM) ||
  isEmptyElement(editor, BULLETED_LIST_ITEM) ||
  isEmptyElement(editor, NUMBERED_LIST_ITEM) ||
  isEmptyElement(editor, CHECKLIST_ITEM);

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
  const [, path] = Editor.node(editor, selection);
  const contents = Editor.string(editor, path);
  return isDefaultBlock(editor) && contents === '/' && anchor.offset === 1;
};

const isAtEdge = (editor, callback) => {
  const { selection } = editor;
  if (!selection || Range.isExpanded(selection)) return false;

  const [, path] = getParentBlock(editor);
  const { anchor } = selection;
  return callback(editor, anchor, path);
};

const isAtBeginning = editor => isAtEdge(editor, Editor.isStart);

const isAtEnd = editor => isAtEdge(editor, Editor.isEnd);

const isEmptyNodeInWrappedBlock = editor =>
  isWrappedBlock(editor) &&
  (isEmptyParagraph(editor) || isEmptyListItem(editor));

const findNodeByTypeAndId = (editor, type, id) => {
  return Editor.nodes(editor, {
    at: documentSelection(editor),
    match: n => n.type === type && n.id === id,
  }).next().value;
};

/*
 * Transforms
 */

const insertDefaultElement = editor => {
  Transforms.insertNodes(editor, DEFAULT_ELEMENT());
};

const removeNodeByTypeAndId = (editor, type, id) => {
  Transforms.removeNodes(editor, {
    at: documentSelection(editor),
    match: n => n.type === type && n.id === id,
  });
};

const unwrapNodeByTypeAndId = (editor, type, id) => {
  Transforms.unwrapNodes(editor, {
    at: documentSelection(editor),
    match: n => n.type === type && n.id === id,
    split: true,
  });
};

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
    let listItemType = BULLETED_LIST_ITEM;
    if (isChecklist) listItemType = CHECKLIST_ITEM;
    if (type === NUMBERED_LIST) listItemType = NUMBERED_LIST_ITEM;

    const payload = {
      type: isActive ? DEFAULT_ELEMENT_TYPE : listItemType,
      depth: 0,
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
    Editor.removeMark(editor, type);
  } else {
    Editor.addMark(editor, type, true);
    track('Mark added to content', { type, source });
  }
};

const removeAllMarks = editor => {
  const marks = Editor.marks(editor);
  const markTypes = Object.keys(marks);

  markTypes.forEach(type => Editor.removeMark(editor, type));
};

const wrapInline = (editor, type, location, source, props = {}) => {
  const options = { split: true };
  if (location) {
    options.at = location;
  }

  Transforms.wrapNodes(editor, { type, ...props }, options);

  track('Inline element inserted to content', { source, type });
};

const insertSectionBreak = editor => {
  Transforms.setNodes(editor, {
    type: SECTION_BREAK,
    children: [{ text: '' }],
  });

  // Make sure we have a node to move the selection to
  if (!Editor.next(editor)) insertDefaultElement(editor);

  return Transforms.move(editor);
};

const clearBlock = editor => {
  const [block] = getParentBlock(editor);

  if (!Editor.isEmpty(editor, block))
    Editor.deleteBackward(editor, { unit: 'block' });
};

const replaceBlock = (editor, type, source) => {
  clearBlock(editor);
  return toggleBlock(editor, type, source);
};

const wrapContextHighlight = (editor, props) => {
  wrapInline(editor, CONTEXT_HIGHLIGHT, null, INLINE_DISCUSSION_SOURCE, props);
};

const removeContextHighlight = (editor, id) => {
  unwrapNodeByTypeAndId(editor, CONTEXT_HIGHLIGHT, id);
};

const wrapInlineAnnotation = (editor, data, range) => {
  const { selection } = editor;
  const [startSelection, endSelection] = Range.edges(selection);
  const [startRange, endRange] = Range.edges(range);

  // Edge cases - Don't wrap if:
  // 1. Selection ends before first character of block
  // 2. Selection starts after last character of block
  if (
    !Range.intersection(range, selection) ||
    Point.equals(endRange, startSelection) ||
    Point.equals(startRange, endSelection)
  )
    return;

  // This is where we select a smaller range of the node if needed
  const at = range;
  if (Range.includes(at, startSelection)) at.anchor = startSelection;
  if (Range.includes(at, endSelection)) at.focus = endSelection;

  wrapInline(
    editor,
    INLINE_THREAD_ANNOTATION,
    at,
    INLINE_DISCUSSION_SOURCE,
    data
  );
};
/*
 * To avoid normalization issues, this function wraps each root node separately.
 * This ensures that inline annotation elements are always children of one of
 * these root block nodes.
 */
const createInlineAnnotation = (editor, data) => {
  const leaves = Array.from(
    Editor.nodes(editor, {
      match: n => Editor.isBlock(editor, n),
      mode: 'lowest',
      voids: true,
    })
  );

  leaves.forEach(([, leafPath]) => {
    const leafRange = Editor.range(editor, leafPath);
    wrapInlineAnnotation(editor, data, leafRange);
  });
};

const updateInlineAnnotation = (editor, discussionId, data) => {
  Transforms.setNodes(editor, data, {
    at: documentSelection(editor),
    match: n =>
      n.type === INLINE_THREAD_ANNOTATION && n.discussionId === discussionId,
  });
};

const removeInlineAnnotation = (editor, discussionId) => {
  Transforms.unwrapNodes(editor, {
    at: documentSelection(editor),
    match: n =>
      n.type === INLINE_THREAD_ANNOTATION && n.discussionId === discussionId,
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

const insertBlockQuote = (editor, text) => {
  if (!isEmptyParagraph(editor)) {
    Transforms.splitNodes(editor, { always: true });
    replaceBlock(editor, DEFAULT_ELEMENT_TYPE);
  }

  Editor.insertText(editor, text);

  // Wrap the text in a block quote, then make sure
  // the next node is unwrapped
  toggleBlock(editor, BLOCK_QUOTE);
  Transforms.splitNodes(editor, { always: true });
  toggleBlock(editor, BLOCK_QUOTE);
};

const insertImage = (editor, src) => {
  const id = Date.now();
  const text = { text: '' };
  const node = { type: IMAGE, id, src, children: [text] };

  if (isEmptyParagraph(editor)) {
    Transforms.setNodes(editor, node);
  } else {
    Transforms.insertNodes(editor, node);
  }

  return node;
};

const updateImage = (editor, id, data) => {
  Transforms.setNodes(editor, data, {
    at: documentSelection(editor),
    match: n => n.type === IMAGE && n.id === id,
    hanging: true,
  });
};

const indentListItem = editor => {
  const { selection } = editor;
  const [node] = Editor.parent(editor, selection, { edge: 'start' });
  const { depth } = node;

  const nextDepth = () => {
    if (!depth) return 1;
    return depth === MAX_LIST_ITEM_DEPTH ? depth : depth + 1;
  };

  Transforms.setNodes(editor, {
    depth: nextDepth(),
  });
};

const outdentListItem = editor => {
  const { selection } = editor;
  const [node] = Editor.parent(editor, selection, { edge: 'start' });
  const { depth } = node;

  Transforms.setNodes(editor, {
    depth: depth === 1 ? undefined : depth - 1,
  });
};

// Merges the current list block with the next one, assuming that they are of
// the same type
const mergeWithNextList = editor => {
  // Make sure selection is at the next list first, since mergeNodes()
  // merges with the previous block node
  Transforms.move(editor);

  const [, path] = getParentBlock(editor, 'highest');
  Transforms.mergeNodes(editor, { at: path });
  Transforms.move(editor, { reverse: true });
};

// Used for manipulating the editor selection when the editor is read-only
const makeDOMSelection = editor => {
  const domSelection = window.getSelection();
  const domRange =
    domSelection && domSelection.rangeCount > 0 && domSelection.getRangeAt(0);

  if (!domRange) return;
  const range = ReactEditor.toSlateRange(editor, domRange);
  Transforms.select(editor, range);
};

const NewEditor = {
  ...Editor,

  // Queries (no transforms)
  documentSelection,
  isElementActive,
  isMarkActive,
  isWrappedBlock,
  isInListBlock,
  isNumberedList,
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
  getCurrentText,
  findNodeByTypeAndId,

  // Transforms
  insertDefaultElement,
  removeNodeByTypeAndId,
  unwrapNodeByTypeAndId,
  toggleBlock,
  toggleMark,
  removeAllMarks,
  wrapInline,
  insertSectionBreak,
  clearBlock,
  replaceBlock,
  wrapContextHighlight,
  removeContextHighlight,
  createInlineAnnotation,
  updateInlineAnnotation,
  removeInlineAnnotation,
  wrapLink,
  unwrapLink,
  insertBlockQuote,
  insertImage,
  updateImage,
  indentListItem,
  outdentListItem,
  mergeWithNextList,
  makeDOMSelection,
};

export default NewEditor;
