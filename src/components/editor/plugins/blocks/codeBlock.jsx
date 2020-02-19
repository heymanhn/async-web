import { DEFAULT_ELEMENT_TYPE } from 'components/editor/utils';
import { CustomEnterAction } from '../helpers';

const CODE_BLOCK = 'code-block';

/* **** Slate plugin **** */

export default function CodeBlockPlugin() {
  /* **** Hotkeys **** */

  function exitBlockOnDoubleEnter(editor, next) {
    if (editor.isWrappedBy(CODE_BLOCK) && editor.isEmptyParagraph()) {
      return editor.setBlocks(DEFAULT_ELEMENT_TYPE).unwrapBlock(CODE_BLOCK);
    }

    return next();
  }

  const hotkeys = [CustomEnterAction(exitBlockOnDoubleEnter)];

  return [hotkeys];
}
