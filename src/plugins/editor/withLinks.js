import isUrl from 'is-url';
import { Transforms } from 'slate';

import { HYPERLINK } from 'utils/editor/constants';

import Editor from 'components/editor/Editor';

const withLinks = oldEditor => {
  const editor = oldEditor;
  const { insertData, insertText, isInline } = editor;

  editor.isInline = element => {
    return element.type === HYPERLINK ? true : isInline(element);
  };

  editor.insertText = text => {
    if (text) {
      if (isUrl(text)) return Editor.wrapLink(editor, text);
    }

    if (text === ' ') {
      const line = Editor.getCurrentText(editor) || '';
      const words = line.split(' ');
      const previousWord = words[words.length - 1];

      if (isUrl(previousWord)) {
        Transforms.move(editor, {
          edge: 'anchor',
          unit: 'offset',
          distance: previousWord.length,
          reverse: true,
        });
        Editor.wrapLink(editor, previousWord);
      }

      Transforms.collapse(editor, { edge: 'focus' });
    }

    return insertText(text);
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
