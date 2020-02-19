import isUrl from 'is-url';
import { Transforms } from 'slate';

import { HYPERLINK } from './utils';
import Editor from './Editor';

const HTTP = 'http://';
const HTTPS = 'https://';
const FTP = 'ftp://';
const MAILTO = 'mailto:';

const appendProtocol = text => {
  if (
    text.startsWith(HTTP) ||
    text.startsWith(HTTPS) ||
    text.startsWith(FTP) ||
    text.startsWith(MAILTO)
  )
    return text;

  return `${HTTP}${text}`;
};

const withLinks = oldEditor => {
  const editor = oldEditor;
  const { insertData, insertText, isInline } = editor;

  editor.isInline = element => {
    return element.type === HYPERLINK ? true : isInline(element);
  };

  editor.insertText = text => {
    if (text) {
      const modText = appendProtocol(text);
      if (isUrl(modText)) return Editor.wrapLink(editor, modText);
    }

    if (text === ' ') {
      const line = Editor.getCurrentText(editor);
      const words = line.split(' ');
      const previousWord = words[words.length - 1];
      const modWord = appendProtocol(previousWord);

      if (isUrl(modWord)) {
        Transforms.move(editor, {
          edge: 'anchor',
          unit: 'offset',
          distance: previousWord.length,
          reverse: true,
        });
        Editor.wrapLink(editor, modWord);
      }

      Transforms.collapse(editor, { edge: 'focus' });
    }

    return insertText(text);
  };

  editor.insertData = data => {
    const text = appendProtocol(data.getData('text/plain'));

    if (text && isUrl(text)) {
      Editor.wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export default withLinks;
