import { Range, Transforms } from 'slate';

import uploadImage from 'utils/imageUpload';

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

const withImages = (oldEditor, resourceId) => {
  const editor = oldEditor;
  const { deleteBackward, insertBreak, insertData, isVoid } = editor;

  const findAndUploadImage = async items => {
    let image;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.type.includes('image')) {
        image = item;
        break;
      }
    }
    if (!image) return null;

    return uploadImage(editor, resourceId, image);
  };

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

  editor.insertData = data => {
    const { files } = data;

    if (files && files.length > 0) {
      return findAndUploadImage(files);
    }

    return insertData(data);
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

  return editor;
};

export default withImages;
