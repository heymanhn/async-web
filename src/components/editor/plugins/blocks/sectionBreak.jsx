/* eslint react/prop-types: 0 */
import { DEFAULT_ELEMENT_TYPE } from 'components/editor/utils';
import { CustomEnterAction, CustomBackspaceAction } from '../helpers';

const SECTION_BREAK = 'section-break';

/* **** Slate plugin **** */

export default function SectionBreak() {
  /* **** Hotkeys **** */

  function exitSectionBreakOnEnter(editor, next) {
    if (editor.hasBlock(SECTION_BREAK)) {
      if (editor.isAtBeginning())
        return editor.insertBlock(DEFAULT_ELEMENT_TYPE);

      next();
      return editor.setBlocks(DEFAULT_ELEMENT_TYPE);
    }

    return next();
  }

  // Instead of selecting the section break, since it's a void block, delete it directly.
  function removeSectionBreak(editor, next) {
    const { value } = editor;
    const { previousBlock } = value;

    if (
      editor.isEmptyParagraph() &&
      previousBlock &&
      previousBlock.type === SECTION_BREAK
    ) {
      return editor.removeNodeByKey(previousBlock.key);
    }

    return next();
  }

  const hotkeys = [
    CustomEnterAction(exitSectionBreakOnEnter),
    CustomBackspaceAction(removeSectionBreak),
  ];

  return [hotkeys];
}
