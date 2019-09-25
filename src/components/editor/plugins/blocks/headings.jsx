/* eslint react/prop-types: 0 */
import React from 'react';
import AutoReplace from 'slate-auto-replace';

import {
  DEFAULT_NODE,
  Hotkey,
  RenderBlock,
  CustomEnterAction,
} from '../helpers';

const LARGE_FONT = 'heading-one';
const MEDIUM_FONT = 'heading-two';
const SMALL_FONT = 'heading-three';

function Headings() {
  /* **** Render methods **** */

  function renderLargeFont(props) {
    const { attributes, children } = props;
    return <h1 {...attributes}>{children}</h1>;
  }

  function renderMediumFont(props) {
    const { attributes, children } = props;
    return <h2 {...attributes}>{children}</h2>;
  }

  function renderSmallFont(props) {
    const { attributes, children } = props;
    return <h3 {...attributes}>{children}</h3>;
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
