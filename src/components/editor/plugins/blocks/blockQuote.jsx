import { CustomBackspaceAction } from '../helpers';

const BLOCK_QUOTE = 'block-quote';

export default function BlockQuotePlugin() {
  /* **** Hotkeys **** */

  function exitOnBackspace(editor, next) {
    const { value } = editor;
    const { startBlock, previousBlock } = value;

    if (editor.isEmptyParagraph() && editor.isWrappedBy(BLOCK_QUOTE)) {
      editor.unwrapBlock(startBlock.key);
      return previousBlock ? editor.removeNodeByKey(startBlock.key) : next();
    }

    return next();
  }

  const hotkeys = [CustomBackspaceAction(exitOnBackspace)];

  return [hotkeys];
}
