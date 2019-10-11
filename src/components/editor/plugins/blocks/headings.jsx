import React from 'react';
import PropTypes from 'prop-types';
import AutoReplace from 'slate-auto-replace';
import styled from '@emotion/styled';

import { DEFAULT_NODE } from 'components/editor/defaults';
import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import MenuOption from 'components/editor/compositionMenu/MenuOption';
import HeadingIcon from './HeadingIcon';
import HeadingOptionIcon from './HeadingOptionIcon';
import {
  Hotkey,
  RenderBlock,
  CustomEnterAction,
} from '../helpers';

const LARGE_FONT = 'heading-one';
const MEDIUM_FONT = 'heading-two';
const SMALL_FONT = 'heading-three';

export const LARGE_TITLE_OPTION_TITLE = 'Large title';
export const SMALL_TITLE_OPTION_TITLE = 'Small title';

/* **** Toolbar buttons **** */

function HeadingButton({ editor, headingType, ...props }) {
  const isActive = editor.hasBlock(headingType);

  function handleClick() {
    return editor.setBlock(headingType);
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <HeadingIcon
        number={headingType === LARGE_FONT ? 1 : 2}
        isActive={isActive}
      />
    </ToolbarButton>
  );
}

HeadingButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

export function LargeFontButton({ editor }) {
  return <HeadingButton editor={editor} headingType={LARGE_FONT} />;
}
export function MediumFontButton({ editor }) {
  return <HeadingButton editor={editor} headingType={MEDIUM_FONT} />;
}

/* **** Composition Menu option **** */

function HeadingOption({ editor, headingType, ...props }) {
  function handleHeadingOption() {
    return editor.clearBlock().setBlock(headingType);
  }

  const icon = <HeadingOptionIcon number={headingType === LARGE_FONT ? 1 : 2} />;

  return (
    <MenuOption
      handleInvoke={handleHeadingOption}
      icon={icon}
      title={headingType === LARGE_FONT ? LARGE_TITLE_OPTION_TITLE : SMALL_TITLE_OPTION_TITLE}
      {...props}
    />
  );
}

HeadingOption.propTypes = {
  editor: PropTypes.object.isRequired,
};

export function LargeTitleOption({ editor, ...props }) {
  return <HeadingOption editor={editor} headingType={LARGE_FONT} {...props} />;
}
export function SmallTitleOption({ editor, ...props }) {
  return <HeadingOption editor={editor} headingType={MEDIUM_FONT} {...props} />;
}

/* **** Slate plugin **** */

const LargeFont = styled.h1({
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '32px',
  marginTop: '1.3em',
});

const MediumFont = styled.h2({
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '26px',
  marginTop: '1.2em',
});

const SmallFont = styled.h3({
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '20px',
  marginTop: '1.1em',
});

export function HeadingsPlugin() {
  /* **** Render methods **** */

  function renderLargeFont(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */
    return <LargeFont {...attributes}>{children}</LargeFont>;
  }

  function renderMediumFont(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */
    return <MediumFont {...attributes}>{children}</MediumFont>;
  }

  function renderSmallFont(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */
    return <SmallFont {...attributes}>{children}</SmallFont>;
  }

  const renderMethods = [
    RenderBlock(LARGE_FONT, renderLargeFont),
    RenderBlock(MEDIUM_FONT, renderMediumFont),
    RenderBlock(SMALL_FONT, renderSmallFont),
  ];

  /* **** Markdown **** */

  const markdownShortcuts = [
    AutoReplace({
      trigger: 'space',
      before: /^(#)$/,
      change: change => change.setBlock(LARGE_FONT),
    }),
    AutoReplace({
      trigger: 'space',
      before: /^(##)$/,
      change: change => change.setBlock(MEDIUM_FONT),
    }),
    AutoReplace({
      trigger: 'space',
      before: /^(###)$/,
      change: change => change.setBlock(SMALL_FONT),
    }),
  ];

  function exitHeadingBlockOnEnter(editor, next) {
    if (editor.hasBlock(LARGE_FONT)
      || editor.hasBlock(MEDIUM_FONT)
      || editor.hasBlock(SMALL_FONT)) {
      if (editor.isAtBeginning()) return editor.insertBlock(DEFAULT_NODE);

      next();
      return editor.setBlocks(DEFAULT_NODE);
    }

    return next();
  }

  /* **** Hotkeys **** */
  const hotkeys = [
    Hotkey('mod+opt+1', editor => editor.setBlock(LARGE_FONT)),
    Hotkey('mod+opt+2', editor => editor.setBlock(MEDIUM_FONT)),
    Hotkey('mod+opt+3', editor => editor.setBlock(SMALL_FONT)),
    CustomEnterAction(exitHeadingBlockOnEnter),
  ];

  return [
    renderMethods,
    markdownShortcuts,
    hotkeys,
  ];
}
