import { DEFAULT_BLOCK_TYPE } from 'components/editor/utils';
import { CustomEnterAction, CustomBackspaceAction } from '../helpers';

const BLOCK_QUOTE = 'block-quote';

export default function BlockQuotePlugin() {
  /* **** Hotkeys **** */

  function exitBlockOnDoubleEnter(editor, next) {
    if (editor.isWrappedBy(BLOCK_QUOTE) && editor.isEmptyParagraph()) {
      return editor.setBlocks(DEFAULT_BLOCK_TYPE).unwrapBlock(BLOCK_QUOTE);
    }

    return next();
  }

  function exitOnBackspace(editor, next) {
    const { value } = editor;
    const { startBlock, previousBlock } = value;

    if (editor.isEmptyParagraph() && editor.isWrappedBy(BLOCK_QUOTE)) {
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
