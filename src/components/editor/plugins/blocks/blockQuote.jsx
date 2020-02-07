import React from 'react';
import PropTypes from 'prop-types';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';

import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';
import { DEFAULT_NODE, COMPOSITION_MENU_SOURCE } from 'components/editor/utils';
import { CustomEnterAction, CustomBackspaceAction } from '../helpers';

const BLOCK_QUOTE = 'block-quote';
export const BLOCK_QUOTE_OPTION_TITLE = 'Quote';

/* **** Composition menu option **** */

export function BlockQuoteOption({ editor, ...props }) {
  function handleBlockQuoteOption() {
    return editor.clearBlock().setBlockQuote(COMPOSITION_MENU_SOURCE);
  }

  const icon = <OptionIcon icon={faQuoteRight} />;

  return (
    <MenuOption
      handleInvoke={handleBlockQuoteOption}
      icon={icon}
      title={BLOCK_QUOTE_OPTION_TITLE}
      {...props}
    />
  );
}

BlockQuoteOption.propTypes = {
  editor: PropTypes.object.isRequired,
};

export function BlockQuotePlugin() {
  /* **** Hotkeys **** */

  function exitBlockOnDoubleEnter(editor, next) {
    if (editor.isWrappedBy(BLOCK_QUOTE) && editor.isEmptyParagraph()) {
      return editor.setBlocks(DEFAULT_NODE).unwrapBlock(BLOCK_QUOTE);
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
