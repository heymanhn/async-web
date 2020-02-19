import { Transforms } from 'slate';

import { DEFAULT_ELEMENT_TYPE, DEFAULT_ELEMENT } from './utils';
import Editor from './Editor';

const handleExitHeadingBlock = (editor, insertBreak) => {
  if (Editor.isAtBeginning(editor)) {
    Transforms.insertNodes(editor, DEFAULT_ELEMENT);
    return Transforms.move(editor);
  }

  insertBreak();
  return Editor.toggleBlock(editor, DEFAULT_ELEMENT_TYPE);
};

const handleExitWrappedBlock = editor =>
  Editor.toggleBlock(editor, DEFAULT_ELEMENT_TYPE);

const withCustomBreaks = oldEditor => {
  const editor = oldEditor;
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    if (Editor.isHeadingBlock(editor))
      return handleExitHeadingBlock(editor, insertBreak);

    if (Editor.isEmptyNodeInWrappedBlock(editor))
      return handleExitWrappedBlock(editor);

    return insertBreak();
  };

  return editor;
};

export default withCustomBreaks;
