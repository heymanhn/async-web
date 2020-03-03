import { Range, Transforms } from 'slate';

import { DEFAULT_ELEMENT_TYPE, DEFAULT_ELEMENT, CODE_HIGHLIGHT } from './utils';
import Editor from './Editor';

const handleExitHeadingBlock = (editor, insertBreak) => {
  if (Editor.isAtBeginning(editor)) {
    Transforms.insertNodes(editor, DEFAULT_ELEMENT);
    return Transforms.move(editor);
  }

  insertBreak();
  Editor.toggleBlock(editor, DEFAULT_ELEMENT_TYPE);
  if (Editor.isEmptyParagraph(editor)) Editor.removeAllMarks(editor);

  return null;
};

const handleExitWrappedBlock = editor => {
  Editor.toggleBlock(editor, DEFAULT_ELEMENT_TYPE);
  Editor.removeAllMarks(editor);
};

const isBeginningOfWrappedBlock = editor => {
  const { selection } = editor;
  return (
    selection &&
    Range.isCollapsed(selection) &&
    Editor.isWrappedBlock(editor) &&
    Editor.isAtBeginning(editor)
  );
};

const isEmptyCodeHighlight = editor =>
  Editor.isMarkActive(editor, CODE_HIGHLIGHT) &&
  Editor.getCurrentText(editor) === '';

const withCustomKeyboardActions = oldEditor => {
  const editor = oldEditor;
  const { deleteBackward, insertBreak } = editor;

  editor.deleteBackward = (...args) => {
    if (isBeginningOfWrappedBlock(editor)) {
      return Editor.toggleBlock(editor, DEFAULT_ELEMENT_TYPE);
    }

    if (isEmptyCodeHighlight(editor)) {
      return Editor.toggleMark(editor, CODE_HIGHLIGHT);
    }

    return deleteBackward(...args);
  };

  editor.insertBreak = () => {
    if (Editor.isHeadingBlock(editor))
      return handleExitHeadingBlock(editor, insertBreak);

    if (Editor.isEmptyNodeInWrappedBlock(editor))
      return handleExitWrappedBlock(editor);

    insertBreak();
    if (Editor.isEmptyParagraph(editor)) Editor.removeAllMarks(editor);

    return null;
  };

  return editor;
};

export default withCustomKeyboardActions;
