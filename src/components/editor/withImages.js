import { Range, Transforms } from 'slate';

import uploadFileMutation from 'graphql/mutations/uploadFile';

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

// NOTE: Need to do this custom way because HOCs don't have access to hooks
// Essentially the same logic as in the useImageUpload hook
const uploadAndInsertImage = async (editor, items, resourceId) => {
  let image;
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.type.includes('image')) {
      image = item;
      break;
    }
  }
  if (!image) return null;

  // Using a global variable until I find a better way
  const client = window.Roval.apolloClient;

  const { id } = Editor.insertImage(editor); // empty image
  const { data } = await client.mutate({
    mutation: uploadFileMutation,
    variables: { resourceId, input: { file: image } },
  });

  if (data.uploadFile) {
    const { url } = data.uploadFile;
    return Editor.updateImage(editor, id, { src: url });
  }

  return Editor.removeImage(editor, id);
};

const withImages = (oldEditor, resourceId) => {
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

  editor.insertData = data => {
    const { files } = data;

    if (files && files.length > 0) {
      return uploadAndInsertImage(editor, files, resourceId);
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
