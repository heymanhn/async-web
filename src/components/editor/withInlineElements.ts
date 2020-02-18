import { INLINE_TYPES } from './utils';

const withInlineElements = oldEditor => {
  const editor = oldEditor;
  const { isInline } = editor;

  editor.isInline = element => {
    return INLINE_TYPES.includes(element.type) ? true : isInline(editor);
  };

  return editor;
};

export default withInlineElements;
