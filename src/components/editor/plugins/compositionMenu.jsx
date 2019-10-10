/* eslint react/prop-types: 0 */
import React from 'react';

import CompositionMenuButton from '../compositionMenu/CompositionMenuButton';
import { DEFAULT_NODE } from '../defaults';
import { AddQueries, RenderEditor } from './helpers';

function CompositionMenu() {
  // This ref is forwarded down to the <CompositionMenu /> component
  const menuRef = React.createRef();

  /* **** Queries **** */

  function isSlashCommand(editor) {
    const { anchorBlock } = editor.value;
    return anchorBlock.type === DEFAULT_NODE && anchorBlock.text === '/';
  }

  /* **** Render the menu **** */
  function displayMenu(props, editor, next) {
    const { mode } = props;
    const children = next();
    if (mode === 'display') return children;

    return (
      <>
        {children}
        <CompositionMenuButton editor={editor} ref={menuRef} />
      </>
    );
  }

  return [
    AddQueries({ isSlashCommand }),
    RenderEditor(displayMenu),
  ];
}

export default CompositionMenu;
