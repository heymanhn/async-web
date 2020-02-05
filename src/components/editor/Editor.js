/* eslint import/prefer-default-export: 0 */
/* eslint no-nested-ternary: 0 */

/*
 * Majority of these plugins borrowed from the Slate examples:
 * https://github.com/ianstormtaylor/slate/blob/master/site/examples/richtext.js
 */
import { Editor as SlateEditor, Transforms } from 'slate';

// SLATE UPGRADE TODO: Any chance to DRY this up?
const LIST_TYPES = ['numbered-list', 'bulleted-list', 'checklist'];

function isBlockActive(editor, format) {
  const [match] = SlateEditor.nodes(editor, {
    match: n => n.type === format,
  });

  return !!match;
}

function isMarkActive(editor, format) {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[format] === true : false;
}

function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    SlateEditor.removeMark(editor, format);
  } else {
    SlateEditor.addMark(editor, format, true);
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
