/* eslint react/prop-types: 0 */
import React from 'react';
import AutoReplace from 'slate-auto-replace';

import {
  DEFAULT_NODE,
  AddSchema,
  Hotkey,
  RenderBlock,
  CustomEnterAction,
} from '../helpers';

const CODE_BLOCK = 'code-block';

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

  /* **** Render methods **** */

  function renderCodeBlock(props) {
    const { attributes, children } = props;

    return <pre {...attributes}>{children}</pre>;
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

  const hotkeys = [
    Hotkey('mod+shift+k', editor => editor.setWrappedBlock(CODE_BLOCK)),
    CustomEnterAction(exitBlockOnDoubleEnter),
  ];

  return [
    AddSchema(codeBlockSchema),
    RenderBlock(CODE_BLOCK, renderCodeBlock),
    markdownShortcuts,
    hotkeys,
  ];
}

export default CodeBlock;
