import React from 'react';
import PropTypes from 'prop-types';
import AutoReplace from 'slate-auto-replace';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import {
  DEFAULT_NODE,
  AddSchema,
  AddCommands,
  Hotkey,
  RenderBlock,
  CustomEnterAction,
  CustomBackspaceAction,
} from '../helpers';

const BLOCK_QUOTE = 'block-quote';

const Container = styled.div({
  cursor: 'pointer',
  margin: 0,
});

export function BlockQuoteButton({ editor, ...props }) {
  function handleClick(event) {
    event.preventDefault();
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
    <Container
      onClick={handleClick}
      onKeyDown={handleClick}
      {...props}
    >
      <ButtonIcon icon={faQuoteRight} isActive={isActive()} />
    </Container>
  );
}

BlockQuoteButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

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
      change: (change) => {
        // Essentially undoing the autoReplace detection
        if (change.isWrappedByAnyBlock()) return change.insertText('> ');

        return change
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
