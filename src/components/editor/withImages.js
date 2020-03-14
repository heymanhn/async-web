import isUrl from 'is-url';
import { Range, Transforms } from 'slate';

import { DEFAULT_ELEMENT_TYPE, IMAGE } from './utils';
import Editor from './Editor';

const isBeginningOfBlock = editor => {
  const { selection } = editor;

  return (
    selection &&
    Range.isCollapsed(selection) &&
    !Editor.isWrappedBlock(editor) &&
    Editor.isAtBeginning(editor)
  );
};

const withImages = oldEditor => {
  const editor = oldEditor;
  const { deleteBackward, insertBreak, insertData, isVoid } = editor;

  editor.isVoid = element => {
    return element.type === IMAGE ? true : isVoid(element);
  };

  editor.insertBreak = () => {
    if (Editor.isElementActive(editor, IMAGE)) {
      // HN: Had to do this extra dance to overcome a likely Slate bug, where
      // repeatedly inserting a break when an image is selected causes a
      // duplicate key warning
      Transforms.move(editor);
      insertBreak();
      Transforms.move(editor, { reverse: true });
      return Editor.toggleBlock(editor, DEFAULT_ELEMENT_TYPE);
    }

    return insertBreak();
  };

  editor.deleteBackward = unit => {
    if (unit === 'character' && isBeginningOfBlock(editor)) {
      const [, path] = Editor.previous(editor, {
        match: n => Editor.isBlock(editor, n),
      });

      if (Editor.isElementActive(editor, IMAGE, path))
        return Transforms.removeNodes(editor);
    }

    return deleteBackward(unit);
  };

  // editor.insertData = data => {
  //   const text = appendProtocol(data.getData('text/plain'));

  //   if (text && isUrl(text)) {
  //     Editor.wrapLink(editor, text);
  //   } else {
  //     insertData(data);
  //   }
  // };

  return editor;
};

export default withImages;
