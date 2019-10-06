/* eslint react/prop-types: 0 */
import React from 'react';
import { findDOMRange } from 'slate-react';

import CompositionMenuButton from '../CompositionMenuButton';
import { RenderEditor } from './helpers';

function CompositionMenu() {
  function displayMenu(props, editor, next) {
    const { mode } = props;
    const { value } = editor;
    const { selection } = value;
    const children = next();
    if (mode === 'display') return children;

    console.dir(selection);

    return (
      <>
        {children}
        <CompositionMenuButton
          // isEmptyParagraph={editor.isEmptyParagraph()}
          range={findDOMRange(selection)}
        />
      </>
    );
  }

  return [RenderEditor(displayMenu)];
}

export default CompositionMenu;
