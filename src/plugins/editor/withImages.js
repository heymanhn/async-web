import { Range, Transforms } from 'slate';

import { IMAGE } from 'utils/editor/constants';
import uploadImage from 'utils/imageUpload';

import Editor from 'components/editor/Editor';

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
    if (Editor.isElementActive(editor, IMAGE))
      return Editor.insertDefaultElement(editor);

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
    if (unit === 'character') {
      if (Editor.isElementActive(editor, IMAGE)) {
        Transforms.removeNodes(editor);
        return Editor.insertDefaultElement(editor);
      }

      if (isBeginningOfBlock(editor)) {
        const prev = Editor.previous(editor, {
          match: n => Editor.isBlock(editor, n),
        });

        const [, path] = prev || [];
        if (path && Editor.isElementActive(editor, IMAGE, path))
          return Transforms.removeNodes(editor);
      }
    }

    return deleteBackward(unit);
  };

  return editor;
};

export default withImages;
