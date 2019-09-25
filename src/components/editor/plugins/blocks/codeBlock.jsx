/* eslint react/prop-types: 0 */
import React from 'react';
import AutoReplace from 'slate-auto-replace';
import styled from '@emotion/styled';

import {
  DEFAULT_NODE,
  AddSchema,
  AddCommands,
  Hotkey,
  RenderBlock,
  CustomEnterAction,
  CustomBackspaceAction,
} from '../helpers';

const CODE_BLOCK = 'code-block';

const StyledCodeBlock = styled.pre(({ theme: { codeFontStack, colors } }) => ({
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  fontFamily: `${codeFontStack}`,
  marginTop: '1em',
  marginBottom: '1em',
  padding: '7px 12px',
  whiteSpace: 'pre-wrap',

  div: {
    marginBottom: '0 !important',
  },

  span: {
    fontFamily: `${codeFontStack}`,
    letterSpacing: '-0.2px',
  },
}));

function CodeBlock() {
  /* **** Schema **** */

  const codeBlockSchema = { blocks: { } };
  codeBlockSchema.blocks[CODE_BLOCK] = {
    nodes: [
      {
        match: { type: DEFAULT_NODE },
      },
    ],
  };

  /* **** Commands **** */

  function setCodeBlock(editor) {
    return editor.setWrappedBlock(CODE_BLOCK);
  }

  /* **** Render methods **** */

  function renderCodeBlock(props) {
    const { attributes, children } = props;

    return <StyledCodeBlock {...attributes}>{children}</StyledCodeBlock>;
  }

  /* **** Markdown **** */

  const markdownShortcuts = [
    AutoReplace({
      trigger: '`',
      before: /^(``)$/,
      change: (change) => {
        // Essentially undoing the autoReplace detection
        if (change.isWrappedByAnyBlock()) return change.insertText('```');

        return change
          .insertBlock(DEFAULT_NODE)
          .moveBackward(1)
          .setBlock(CODE_BLOCK);
      },
    }),
  ];

  /* **** Hotkeys **** */

  function exitBlockOnDoubleEnter(editor, next) {
    if (editor.isWrappedBy(CODE_BLOCK) && editor.isEmptyParagraph()) {
      return editor.setBlocks(DEFAULT_NODE).unwrapBlock(CODE_BLOCK);
    }

    return next();
  }

  function exitOnBackspace(editor, next) {
    const { value } = editor;
    const { anchorBlock, previousBlock } = value;

    if (editor.isEmptyParagraph() && editor.isWrappedBy(CODE_BLOCK)) {
      editor.unwrapBlock(anchorBlock.key);
      return previousBlock ? editor.removeNodeByKey(anchorBlock.key) : next();
    }

    return next();
  }

  const hotkeys = [
    Hotkey('mod+shift+k', editor => editor.setWrappedBlock(CODE_BLOCK)),
    CustomEnterAction(exitBlockOnDoubleEnter),
    CustomBackspaceAction(exitOnBackspace),
  ];

  return [
    AddSchema(codeBlockSchema),
    AddCommands({ setCodeBlock }),
    RenderBlock(CODE_BLOCK, renderCodeBlock),
    markdownShortcuts,
    hotkeys,
  ];
}

export default CodeBlock;
