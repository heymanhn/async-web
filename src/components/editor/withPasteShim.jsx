// Slate isn't pasting plaintext with new lines propertly.
// We need this patch until that is addressed.
import { Transforms } from 'slate';
import Editor from './Editor';
import { CODE_BLOCK } from './utils';

const withPasteShim = oldEditor => {
  const editor = oldEditor;
  const { insertData } = editor;

  editor.insertData = data => {
    const text = data.getData('text/plain');

    if (text) {
      let lines = text.split('\n');

      // We want to mimic pasting of plain-text behavior in CODE_BLOCK, aka preserve empty lines.
      if (!Editor.isElementActive(editor, CODE_BLOCK)) {
        lines = lines.filter(l => !!l);
      }

      lines.forEach((line, index) => {
        if (index > 0) {
          Transforms.splitNodes(editor, { always: true });
        }

        Transforms.insertText(editor, line);
      });

      return;
    }

    insertData(data);
  };

  return editor;
};

export default withPasteShim;
