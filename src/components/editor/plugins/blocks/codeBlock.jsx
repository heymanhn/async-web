import React from 'react';
import PropTypes from 'prop-types';
import AutoReplace from 'slate-auto-replace';
import { faCode } from '@fortawesome/free-solid-svg-icons';
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

const CODE_BLOCK = 'code-block';

const Container = styled.div({
  cursor: 'pointer',
  margin: 0,
});

export function CodeBlockButton({ editor, ...props }) {
  function handleClick(event) {
    event.preventDefault();
    return editor.setCodeBlock();
  }

  function isActive() {
    const { value: { document, blocks } } = editor;

    if (blocks.size > 0) {
      const parent = document.getParent(blocks.first().key);
      return (parent && parent.type === CODE_BLOCK);
    }

    return false;
  }

  return (
    <Container
      onClick={handleClick}
      onKeyDown={handleClick}
      {...props}
    >
      <ButtonIcon icon={faCode} isActive={isActive()} />
    </Container>
  );
}

CodeBlockButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

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

export function CodeBlockPlugin() {
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
    const { attributes, children } = props; /* eslint react/prop-types: 0 */

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
