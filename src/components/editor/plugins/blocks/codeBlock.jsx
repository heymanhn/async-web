import React from 'react';
import PropTypes from 'prop-types';
import { faCode } from '@fortawesome/free-solid-svg-icons';

import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';
import { DEFAULT_NODE, COMPOSITION_MENU_SOURCE } from 'components/editor/utils';
import { CustomEnterAction, CustomBackspaceAction } from '../helpers';

const CODE_BLOCK = 'code-block';
export const CODE_BLOCK_OPTION_TITLE = 'Code block';

/* **** Composition menu option **** */

export function CodeBlockOption({ editor, ...props }) {
  function handleCodeBlockOption() {
    return editor.clearBlock().setCodeBlock(COMPOSITION_MENU_SOURCE);
  }

  const icon = <OptionIcon icon={faCode} />;

  return (
    <MenuOption
      handleInvoke={handleCodeBlockOption}
      icon={icon}
      title={CODE_BLOCK_OPTION_TITLE}
      {...props}
    />
  );
}

CodeBlockOption.propTypes = {
  editor: PropTypes.object.isRequired,
};

/* **** Slate plugin **** */

export function CodeBlockPlugin() {
  /* **** Hotkeys **** */

  function exitBlockOnDoubleEnter(editor, next) {
    if (editor.isWrappedBy(CODE_BLOCK) && editor.isEmptyParagraph()) {
      return editor.setBlocks(DEFAULT_NODE).unwrapBlock(CODE_BLOCK);
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
