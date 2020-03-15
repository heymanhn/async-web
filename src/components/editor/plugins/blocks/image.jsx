import { track } from 'utils/analytics';

import {
  DEFAULT_ELEMENT_TYPE,
  CUT_PASTE_SOURCE,
} from 'components/editor/utils';
import {
  AddCommands,
  CustomBackspaceAction,
  CustomEnterAction,
  CustomDropAction,
  CustomPasteAction,
} from '../helpers';

/* **** Slate plugin **** */

export default function Image() {
  // Need to ensure there's at least a text block present in the composer before the image
  // is deleted.
  function ensureBlockPresentOnRemove(editor, next) {
    if (editor.hasBlock(IMAGE)) {
      const { startBlock } = editor.value;
      const { key } = startBlock;

      return editor.insertBlock(DEFAULT_ELEMENT_TYPE).removeNodeByKey(key);
    }

    return next();
  }

  // Inspired by https://stackoverflow.com/questions/6333814/
  async function uploadAndInsertImage(items, editor, next) {
    let image;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.kind === 'file' && item.type.includes('image')) {
        image = item.getAsFile();
        break;
      }
    }
    if (!image) return next();

    const client = window.Roval.apolloClient; // Using a global variable until I find a better way
    editor.insertImageLoadingIndicator();
    const { resourceId } = editor.props;
    const { data } = await client.mutate({
      mutation: uploadFileMutation,
      variables: { resourceId, input: { file: image } },
    });

    if (data && data.uploadFile) {
      const { url } = data.uploadFile;
      return editor
        .removeImageLoadingIndicator()
        .insertImage(url, CUT_PASTE_SOURCE);
    }

    editor.removeImageLoadingIndicator();
    return next();
  }

  async function insertImageOnPaste(event, editor, next) {
    const { clipboardData } = event;
    const { items } = clipboardData;

    const response = await uploadAndInsertImage(items, editor, next);
    return response;
  }

  async function insertImageOnDrop(event, editor, next) {
    const { dataTransfer } = event;
    const { items } = dataTransfer;

    const response = await uploadAndInsertImage(items, editor, next);
    return response;
  }

  return [
    AddCommands({ insertImage }),
    CustomBackspaceAction(ensureBlockPresentOnRemove),
    CustomEnterAction(insertNewBlockOnEnter),
    CustomDropAction(insertImageOnDrop),
    CustomPasteAction(insertImageOnPaste),
  ];
}
