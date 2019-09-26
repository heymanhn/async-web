/* eslint react/prop-types: 0 */
import React from 'react';
import AutoReplace from 'slate-auto-replace';
import styled from '@emotion/styled';

import { DEFAULT_NODE } from 'components/editor/defaults';
import {
  Hotkey,
  RenderBlock,
  CustomEnterAction,
} from '../helpers';

const LARGE_FONT = 'heading-one';
const MEDIUM_FONT = 'heading-two';
const SMALL_FONT = 'heading-three';

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

function Headings() {
  /* **** Render methods **** */

  function renderLargeFont(props) {
    const { attributes, children } = props;
    return <LargeFont {...attributes}>{children}</LargeFont>;
  }

  function renderMediumFont(props) {
    const { attributes, children } = props;
    return <MediumFont {...attributes}>{children}</MediumFont>;
  }

  function renderSmallFont(props) {
    const { attributes, children } = props;
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

export default Headings;
