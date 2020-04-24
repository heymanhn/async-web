import { INLINE_THREAD_TYPES } from 'utils/editor/constants';

const withInlineDiscussions = oldEditor => {
  const editor = oldEditor;
  const { isInline } = editor;

  editor.isInline = element => {
    return INLINE_THREAD_TYPES.includes(element.type)
      ? true
      : isInline(element);
  };

  return editor;
};

export default withInlineDiscussions;
