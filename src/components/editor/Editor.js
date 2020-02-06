/* eslint import/prefer-default-export: 0 */
/* eslint no-nested-ternary: 0 */

/*
 * Majority of these plugins borrowed from the Slate examples:
 * https://github.com/ianstormtaylor/slate/blob/master/site/examples/richtext.js
 */
import { Editor as SlateEditor, Transforms } from 'slate';

import { LIST_TYPES, WRAPPED_TYPES } from './utils';

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

function toggleBlock(editor, type) {
  const isActive = isBlockActive(editor, type);
  const isList = LIST_TYPES.includes(type);
  const isWrapped = WRAPPED_TYPES.includes(type);

  Transforms.unwrapNodes(editor, {
    match: n => WRAPPED_TYPES.includes(n.type),
    split: true,
  });

  if (!isWrapped || isList) {
    Transforms.setNodes(editor, {
      type: isActive ? 'paragraph' : isList ? 'list-item' : type,
    });
  }

  if (!isActive && isWrapped) {
    const block = { type, children: [] };
    Transforms.wrapNodes(editor, block);
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
