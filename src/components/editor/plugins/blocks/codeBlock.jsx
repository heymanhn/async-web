import React from 'react';
import PropTypes from 'prop-types';
import AutoReplace from 'slate-auto-replace';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';
import {
  DEFAULT_NODE,
  COMPOSITION_MENU_SOURCE,
  HOTKEY_SOURCE,
  MARKDOWN_SOURCE,
  TOOLBAR_SOURCE,
} from 'components/editor/utils';
import {
  AddSchema,
  AddCommands,
  Hotkey,
  RenderBlock,
  CustomEnterAction,
  CustomBackspaceAction,
} from '../helpers';

const CODE_BLOCK = 'code-block';
export const CODE_BLOCK_OPTION_TITLE = 'Code block';

/* **** Toolbar button **** */

export function CodeBlockButton({ editor, ...props }) {
  function handleClick() {
    return editor.setCodeBlock(TOOLBAR_SOURCE);
  }

  function isActive() {
    const {
      value: { document, blocks },
    } = editor;

    if (blocks.size > 0) {
      const parent = document.getParent(blocks.first().key);
      return parent && parent.type === CODE_BLOCK;
    }

    return false;
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon={faCode} isActive={isActive()} />
    </ToolbarButton>
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
  marginTop: '20px',
  marginBottom: '20px',
  padding: '7px 12px',
  whiteSpace: 'pre-wrap',

  div: {
    fontSize: '14px',
    marginTop: '0 !important',
    marginBottom: '0 !important',
  },

  span: {
    fontFamily: `${codeFontStack}`,
    letterSpacing: '-0.2px',
  },
}));

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
  /* **** Schema **** */

  const codeBlockSchema = { blocks: {} };
  codeBlockSchema.blocks[CODE_BLOCK] = {
    nodes: [
      {
        match: { type: DEFAULT_NODE },
      },
    ],
  };

  /* **** Commands **** */

  function setCodeBlock(editor, source) {
    return editor.setWrappedBlock(CODE_BLOCK, source);
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
      change: editor => {
        // Essentially undoing the autoReplace detection
        if (editor.isWrappedByAnyBlock()) return editor.insertText('```');
        if (!editor.isEmptyBlock()) return editor.setCodeBlock(MARKDOWN_SOURCE);

        return editor
          .insertBlock(DEFAULT_NODE)
          .moveBackward(1)
          .setCodeBlock(MARKDOWN_SOURCE);
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
    const { startBlock, previousBlock } = value;

    if (editor.isEmptyParagraph() && editor.isWrappedBy(CODE_BLOCK)) {
      editor.unwrapBlock(startBlock.key);
      return previousBlock ? editor.removeNodeByKey(startBlock.key) : next();
    }

    return next();
  }

  const hotkeys = [
    Hotkey('mod+shift+k', editor => editor.setCodeBlock(HOTKEY_SOURCE)),
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
