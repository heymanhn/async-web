import { Range, Transforms } from 'slate';

import { DEFAULT_ELEMENT_TYPE, CODE_HIGHLIGHT, LIST_ITEM_TYPES } from './utils';
import Editor from './Editor';

const handleExitHeadingBlock = (editor, insertBreak) => {
  if (Editor.isAtBeginning(editor)) {
    Editor.insertDefaultElement(editor);
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

const isBeginningOfListItem = editor => {
  const { selection } = editor;
  return (
    selection &&
    Range.isCollapsed(selection) &&
    Editor.isAtBeginning(editor) &&
    Editor.isInListBlock(editor)
  );
};

const isBetweenListItems = editor => {
  const next = Editor.next(editor, {
    match: n => Editor.isBlock(editor, n),
    mode: 'lowest',
  });

  const previous = Editor.previous(editor, {
    match: n => Editor.isBlock(editor, n),
    mode: 'lowest',
  });

  if (!next || !previous) return false;

  const [nextNode] = next;
  const [prevNode] = previous;
  return (
    LIST_ITEM_TYPES.includes(nextNode.type) && nextNode.type === prevNode.type
  );
};

const isEmptyCodeHighlight = editor =>
  Editor.isMarkActive(editor, CODE_HIGHLIGHT) &&
  Editor.getCurrentText(editor) === '';

const withCustomKeyboardActions = oldEditor => {
  const editor = oldEditor;
  const { deleteBackward, insertBreak } = editor;

  editor.deleteBackward = unit => {
    if (unit === 'character') {
      if (isBeginningOfListItem(editor)) {
        return Editor.toggleBlock(editor, DEFAULT_ELEMENT_TYPE);
      }

      if (Editor.isEmptyParagraph(editor) && isBetweenListItems(editor)) {
        deleteBackward(unit);
        return Editor.mergeWithNextList(editor);
      }

      if (isEmptyCodeHighlight(editor)) {
        return Editor.toggleMark(editor, CODE_HIGHLIGHT);
      }
    }

    return deleteBackward(unit);
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
