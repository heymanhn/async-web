/* eslint react/prop-types: 0 */
import React from 'react';
import AutoReplace from 'slate-auto-replace';

import {
  DEFAULT_NODE,
  AddSchema,
  RenderBlock,
  CustomEnterAction,
} from '../helpers';

const SECTION_BREAK = 'section-break';

function SectionBreak() {
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
    return <hr {...attributes} />;
  }

  /* **** Markdown **** */

  const markdownShortcut = AutoReplace({
    trigger: '-',
    before: /^(--)$/,
    change: change => change.setBlocks('section-break').insertBlock(DEFAULT_NODE),
  });

  /* **** Custom enter key-press behaviors **** */

  function exitSectionBreakOnEnter(editor, next) {
    if (editor.hasBlock(SECTION_BREAK)) {
      if (editor.isAtBeginning()) return editor.insertBlock(DEFAULT_NODE);

      next();
      return editor.setBlocks(DEFAULT_NODE);
    }

    return next();
  }

  return [
    AddSchema(sectionBreakSchema),
    RenderBlock(SECTION_BREAK, renderSectionBreak),
    markdownShortcut,
    CustomEnterAction(exitSectionBreakOnEnter),
  ];
}

export default SectionBreak;
