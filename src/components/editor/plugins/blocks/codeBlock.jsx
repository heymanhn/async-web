import { DEFAULT_BLOCK_TYPE } from 'components/editor/utils';
import { CustomEnterAction, CustomBackspaceAction } from '../helpers';

const CODE_BLOCK = 'code-block';

/* **** Slate plugin **** */

export default function CodeBlockPlugin() {
  /* **** Hotkeys **** */

  function exitBlockOnDoubleEnter(editor, next) {
    if (editor.isWrappedBy(CODE_BLOCK) && editor.isEmptyParagraph()) {
      return editor.setBlocks(DEFAULT_BLOCK_TYPE).unwrapBlock(CODE_BLOCK);
    }

    return next();
  }

  function exitOnBackspace(editor, next) {
    const { value } = editor;
    const { startBlock, previousBlock } = value;

    if (editor.isEmptyParagraph() && editor.isWrappedBy(CODE_BLOCK)) {
      editor.unwrapBlock(startBlock.key);
      return previousBlock ? editor.removeNodeByKey(startBlock.key) : next();
    }

    return next();
  }

  const hotkeys = [
    CustomEnterAction(exitBlockOnDoubleEnter),
    CustomBackspaceAction(exitOnBackspace),
  ];

  return [hotkeys];
}
