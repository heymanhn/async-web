import { DEFAULT_BLOCK_TYPE } from 'components/editor/utils';
import { CustomEnterAction } from '../helpers';

const LARGE_FONT = 'heading-one';
const MEDIUM_FONT = 'heading-two';
const SMALL_FONT = 'heading-three';

const HeadingsPlugin = () => {
  function exitHeadingBlockOnEnter(editor, next) {
    if (
      editor.hasBlock(LARGE_FONT) ||
      editor.hasBlock(MEDIUM_FONT) ||
      editor.hasBlock(SMALL_FONT)
    ) {
      if (editor.isAtBeginning()) return editor.insertBlock(DEFAULT_BLOCK_TYPE);

      next();
      return editor.setBlocks(DEFAULT_BLOCK_TYPE);
    }

    return next();
  }

  /* **** Hotkeys **** */
  const hotkeys = [CustomEnterAction(exitHeadingBlockOnEnter)];

  return [hotkeys];
};

export default HeadingsPlugin;
