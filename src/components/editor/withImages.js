import isUrl from 'is-url';
import { Transforms } from 'slate';

import { IMAGE } from './utils';
import Editor from './Editor';

const withImages = oldEditor => {
  const editor = oldEditor;
  const { insertData, isVoid } = editor;

  editor.isVoid = element => {
    return element.type === IMAGE ? true : isVoid(element);
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
