import { Transforms } from 'slate';

import { DEFAULT_BLOCK_TYPE, DEFAULT_BLOCK } from './utils';
import Editor from './Editor';

const exitHeadingBlockOnEnter = (editor, insertBreak) => {
  if (Editor.isAtBeginning(editor)) {
    Transforms.insertNodes(editor, DEFAULT_BLOCK);
    return Transforms.move(editor);
  }

  insertBreak();
  return Editor.toggleBlock(editor, DEFAULT_BLOCK_TYPE);
};

const withCustomBreaks = oldEditor => {
  const editor = oldEditor;
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    if (Editor.isHeadingBlock(editor)) {
      return exitHeadingBlockOnEnter(editor, insertBreak);
    }

    return insertBreak();
  };

  return editor;
};

export default withCustomBreaks;
