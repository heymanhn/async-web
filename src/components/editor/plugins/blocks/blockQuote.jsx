import React from 'react';
import PropTypes from 'prop-types';
import AutoReplace from 'slate-auto-replace';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';
import { DEFAULT_NODE } from 'components/editor/defaults';
import {
  AddSchema,
  AddCommands,
  Hotkey,
  RenderBlock,
  CustomEnterAction,
  CustomBackspaceAction,
} from '../helpers';

const BLOCK_QUOTE = 'block-quote';

/* **** Toolbar button **** */

export function BlockQuoteButton({ editor, ...props }) {
  function handleClick() {
    return editor.setBlockQuote();
  }

  function isActive() {
    const { value: { document, blocks } } = editor;

    if (blocks.size > 0) {
      const parent = document.getParent(blocks.first().key);
      return (parent && parent.type === BLOCK_QUOTE);
    }

    return false;
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon={faQuoteRight} isActive={isActive()} />
    </ToolbarButton>
  );
}

BlockQuoteButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

/* **** Composition menu option **** */

export function BlockQuoteOption({ editor, ...props }) {
  function handleClick() {
    return editor.setBlockQuote();
  }

  const icon = <OptionIcon icon={faQuoteRight} />;

  return (
    <MenuOption
      handleClick={handleClick}
      icon={icon}
      title="Quote"
      {...props}
    />
  );
}

BlockQuoteOption.propTypes = {
  editor: PropTypes.object.isRequired,
};

/* **** Slate plugin **** */

const StyledBlockQuote = styled.blockquote(({ theme: { colors } }) => ({
  marginTop: '1em',
  borderLeft: `3px solid ${colors.borderGrey}`,
  color: colors.grey2,
  padding: '0px 12px',
  marginBottom: '10px',
}));

export function BlockQuotePlugin() {
  /* **** Schema **** */

  const blockQuoteSchema = { blocks: { } };
  blockQuoteSchema.blocks[BLOCK_QUOTE] = {
    nodes: [
      {
        match: { type: DEFAULT_NODE },
      },
    ],
  };

  /* **** Commands **** */

  function setBlockQuote(editor) {
    return editor.setWrappedBlock(BLOCK_QUOTE);
  }

  /* **** Render methods **** */

  function renderBlockQuote(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */

    return <StyledBlockQuote {...attributes}>{children}</StyledBlockQuote>;
  }

  /* **** Markdown **** */

  const markdownShortcuts = [
    AutoReplace({
      trigger: 'space',
      before: /^(>)$/,
      change: (editor) => {
        // Essentially undoing the autoReplace detection
        if (editor.isWrappedByAnyBlock()) return editor.insertText('> ');
        if (!editor.isEmptyBlock()) return editor.setBlockQuote();

        return editor
          .insertBlock(DEFAULT_NODE)
          .moveBackward(1)
          .setBlockQuote();
      },
    }),
  ];

  /* **** Hotkeys **** */

  function exitBlockOnDoubleEnter(editor, next) {
    if (editor.isWrappedBy(BLOCK_QUOTE) && editor.isEmptyParagraph()) {
      return editor.setBlocks(DEFAULT_NODE).unwrapBlock(BLOCK_QUOTE);
    }

    return next();
  }

  function exitOnBackspace(editor, next) {
    const { value } = editor;
    const { anchorBlock, previousBlock } = value;

    if (editor.isEmptyParagraph() && editor.isWrappedBy(BLOCK_QUOTE)) {
      editor.unwrapBlock(anchorBlock.key);
      return previousBlock ? editor.removeNodeByKey(anchorBlock.key) : next();
    }

    return next();
  }

  const hotkeys = [
    Hotkey('mod+shift+9', editor => editor.setWrappedBlock(BLOCK_QUOTE)),
    CustomEnterAction(exitBlockOnDoubleEnter),
    CustomBackspaceAction(exitOnBackspace),
  ];

  return [
    AddSchema(blockQuoteSchema),
    AddCommands({ setBlockQuote }),
    RenderBlock(BLOCK_QUOTE, renderBlockQuote),
    markdownShortcuts,
    hotkeys,
  ];
}
