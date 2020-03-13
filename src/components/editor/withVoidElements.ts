import { VOID_TYPES } from './utils';

const withVoidElements = oldEditor => {
  const editor = oldEditor;
  const { isVoid } = editor;

  editor.isVoid = element => {
    return VOID_TYPES.includes(element.type) ? true : isVoid(element);
  };

  return editor;
};

export default withVoidElements;
