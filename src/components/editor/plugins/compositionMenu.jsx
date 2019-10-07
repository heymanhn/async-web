/* eslint react/prop-types: 0 */
import React from 'react';

import CompositionMenuButton from '../CompositionMenuButton';
import { RenderEditor } from './helpers';

function CompositionMenu() {
  function displayMenu(props, editor, next) {
    const { mode } = props;
    const children = next();
    if (mode === 'display') return children;

    return (
      <>
        {children}
        <CompositionMenuButton
          isEmptyParagraph={editor.isEmptyParagraph()}
        />
      </>
    );
  }

  return [RenderEditor(displayMenu)];
}

export default CompositionMenu;
