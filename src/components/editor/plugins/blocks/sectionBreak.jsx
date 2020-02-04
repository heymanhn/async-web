/* eslint react/prop-types: 0 */
import React from 'react';
import AutoReplace from 'slate-auto-replace';
import { faHorizontalRule } from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled';

import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';

import {
  DEFAULT_NODE,
  COMPOSITION_MENU_SOURCE,
  MARKDOWN_SOURCE,
} from 'components/editor/utils';
import {
  AddSchema,
  RenderBlock,
  CustomEnterAction,
  CustomBackspaceAction,
} from '../helpers';

const SECTION_BREAK = 'section-break';
export const SECTION_BREAK_OPTION_TITLE = 'Section break';

/* **** Composition menu option **** */

export function SectionBreakOption({ editor, ...props }) {
  function handleSectionBreakOption() {
    return editor
      .clearBlock()
      .setBlock(SECTION_BREAK, COMPOSITION_MENU_SOURCE)
      .insertBlock(DEFAULT_NODE);
  }

  const icon = <OptionIcon icon={faHorizontalRule} />;

  return (
    <MenuOption
      handleInvoke={handleSectionBreakOption}
      icon={icon}
      title={SECTION_BREAK_OPTION_TITLE}
      {...props}
    />
  );
}

/* **** Slate plugin **** */

const StyledSectionBreak = styled.hr(({ theme: { colors } }) => ({
  borderRadius: '20px',
  borderTop: `2px solid ${colors.borderGrey}`,
  margin: '2em auto',
  width: '120px',
}));

export function SectionBreak() {
  /* **** Schema **** */

  const sectionBreakSchema = {
    blocks: {
      'section-break': {
        isVoid: true,
      },
    },
  };

  /* **** Render methods **** */

  function renderSectionBreak(props) {
    const { attributes } = props;
    return <StyledSectionBreak {...attributes} />;
  }

  /* **** Markdown **** */

  const markdownShortcut = AutoReplace({
    trigger: '-',
    before: /^(--)$/,
    change: change =>
      change.setBlock(SECTION_BREAK, MARKDOWN_SOURCE).insertBlock(DEFAULT_NODE),
  });

  /* **** Hotkeys **** */

  function exitSectionBreakOnEnter(editor, next) {
    if (editor.hasBlock(SECTION_BREAK)) {
      if (editor.isAtBeginning()) return editor.insertBlock(DEFAULT_NODE);

      next();
      return editor.setBlocks(DEFAULT_NODE);
    }

    return next();
  }

  // Instead of selecting the section break, since it's a void block, delete it directly.
  function removeSectionBreak(editor, next) {
    const { value } = editor;
    const { previousBlock } = value;

    if (
      editor.isEmptyParagraph() &&
      previousBlock &&
      previousBlock.type === SECTION_BREAK
    ) {
      return editor.removeNodeByKey(previousBlock.key);
    }

    return next();
  }

  const hotkeys = [
    CustomEnterAction(exitSectionBreakOnEnter),
    CustomBackspaceAction(removeSectionBreak),
  ];

  return [
    AddSchema(sectionBreakSchema),
    RenderBlock(SECTION_BREAK, renderSectionBreak),
    markdownShortcut,
    hotkeys,
  ];
}
