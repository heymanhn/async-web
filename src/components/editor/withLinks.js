import isUrl from 'is-url';

import { HYPERLINK } from './utils';
import Editor from './Editor';

const withLinks = oldEditor => {
  const editor = oldEditor;
  const { insertData, insertText, isInline } = editor;

  editor.isInline = element => {
    return element.type === HYPERLINK ? true : isInline(element);
  };

  editor.insertText = text => {
    if (text && isUrl(text)) {
      Editor.wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = data => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      Editor.wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export default withLinks;
