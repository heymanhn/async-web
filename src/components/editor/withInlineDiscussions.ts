import { INLINE_DISCUSSION_TYPES } from './utils';

const withInlineDiscussions = oldEditor => {
  const editor = oldEditor;
  const { isInline } = editor;

  editor.isInline = element => {
    return INLINE_DISCUSSION_TYPES.includes(element.type)
      ? true
      : isInline(editor);
  };

  return editor;
};

export default withInlineDiscussions;
