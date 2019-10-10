/* eslint react/prop-types: 0 */
import React from 'react';

import CompositionMenuButton from '../compositionMenu/CompositionMenuButton';
import { DEFAULT_NODE } from '../defaults';
import { AddQueries, Hotkey, RenderEditor } from './helpers';

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

  /* **** Hotkeys for selecting menu items **** */
  /* Only forward the keyboard event if the menu is open */

  function handleArrowKey(key, editor, next, event) {
    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();

    if (!rect.width && !rect.height) return next();

    event.preventDefault();
    const keyboardEvent = new KeyboardEvent('keydown', { key });
    return menu.dispatchEvent(keyboardEvent);
  }

  function handleDownArrow(...args) {
    return handleArrowKey('ArrowDown', ...args);
  }

  function handleUpArrow(...args) {
    return handleArrowKey('ArrowUp', ...args);
  }

  return [
    AddQueries({ isSlashCommand }),
    RenderEditor(displayMenu),
    Hotkey('down', handleDownArrow),
    Hotkey('up', handleUpArrow),
  ];
}

export default CompositionMenu;
