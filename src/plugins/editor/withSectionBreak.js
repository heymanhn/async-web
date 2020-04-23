import { SECTION_BREAK } from 'utils/editor/constants';

const withSectionBreak = oldEditor => {
  const editor = oldEditor;
  const { isVoid } = editor;

  editor.isVoid = element => {
    return element.type === SECTION_BREAK ? true : isVoid(element);
  };

  return editor;
};

export default withSectionBreak;
