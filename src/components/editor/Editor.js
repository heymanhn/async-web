/* eslint import/prefer-default-export: 0 */
/* eslint no-nested-ternary: 0 */

/*
 * Majority of these plugins borrowed from the Slate examples:
 * https://github.com/ianstormtaylor/slate/blob/master/site/examples/richtext.js
 */
import { Editor as SlateEditor, Transforms } from 'slate';

import { track } from 'utils/analytics';

import {
  DEFAULT_NODE,
  LIST_TYPES,
  WRAPPED_TYPES,
  CHECKLIST,
  LIST_ITEM,
  CHECKLIST_ITEM,
} from './utils';

function isBlockActive(editor, type) {
  const [match] = SlateEditor.nodes(editor, {
    match: n => n.type === type,
  });

  return !!match;
}

function isMarkActive(editor, type) {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[type] === true : false;
}

function toggleBlock(editor, type, source) {
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
    const block = { type, children: [] };
    Transforms.wrapNodes(editor, block);
  }

  // We're not interested in tracking text blocks...
  if (!isActive && type !== DEFAULT_NODE) {
    track('Block inserted to content', { type, source });
  }
}

function toggleMark(editor, type) {
  const isActive = isMarkActive(editor, type);

  if (isActive) {
    SlateEditor.removeMark(editor, type);
  } else {
    SlateEditor.addMark(editor, type, true);
  }
}

const Editor = {
  ...SlateEditor,
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
};

export default Editor;
