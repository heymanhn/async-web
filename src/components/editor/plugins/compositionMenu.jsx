/* eslint react/prop-types: 0 */
import React from 'react';

import CompositionMenuButton from '../compositionMenu/CompositionMenuButton';
import { RenderEditor } from './helpers';

function CompositionMenu() {
  function displayMenu(props, editor, next) {
    const { mode } = props;
    const children = next();
    if (mode === 'display') return children;

    return (
      <>
        {children}
        <CompositionMenuButton editor={editor} />
      </>
    );
  }

  return [RenderEditor(displayMenu)];
}

export default CompositionMenu;
