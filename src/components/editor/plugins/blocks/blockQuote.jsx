/* eslint react/prop-types: 0 */
import React from 'react';
import AutoReplace from 'slate-auto-replace';
import styled from '@emotion/styled';

import {
  DEFAULT_NODE,
  AddSchema,
  Hotkey,
  RenderBlock,
  CustomEnterAction,
} from '../helpers';

const BLOCK_QUOTE = 'block-quote';

const StyledBlockQuote = styled.blockquote(({ theme: { colors } }) => ({
  marginTop: '1em',
  borderLeft: `3px solid ${colors.borderGrey}`,
  color: colors.grey2,
  padding: '0px 12px',
  marginBottom: '10px',
}));

function BlockQuote() {
  /* **** Schema **** */

  const blockQuoteSchema = { blocks: { } };
  blockQuoteSchema.blocks[BLOCK_QUOTE] = {
    nodes: [
      {
        match: { type: DEFAULT_NODE },
      },
    ],
  };

  /* **** Render methods **** */

  function renderBlockQuote(props) {
    const { attributes, children } = props;

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
          .setBlock(BLOCK_QUOTE);
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

  const hotkeys = [
    Hotkey('mod+shift+9', editor => editor.setWrappedBlock(BLOCK_QUOTE)),
    CustomEnterAction(exitBlockOnDoubleEnter),
  ];

  return [
    AddSchema(blockQuoteSchema),
    RenderBlock(BLOCK_QUOTE, renderBlockQuote),
    markdownShortcuts,
    hotkeys,
  ];
}

export default BlockQuote;
