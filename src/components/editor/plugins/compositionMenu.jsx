/* eslint react/prop-types: 0 */
import React from 'react';

import CompositionMenuButton from '../compositionMenu/CompositionMenuButton';
import CompositionMenuPlaceholder from '../compositionMenu/CompositionMenuPlaceholder';
import { DEFAULT_NODE } from '../defaults';
import { AddQueries, Hotkey, RenderEditor } from './helpers';

function CompositionMenu() {
  // This ref is forwarded down to the <CompositionMenu /> component
  const menuRef = React.createRef();

  /* **** Queries **** */

  function isSlashCommand(editor) {
    const { startBlock } = editor.value;
    return startBlock.type === DEFAULT_NODE && startBlock.text === '/';
  }

  /* **** Render the menu **** */
  function displayMenu(props, editor, next) {
    const { mode } = props;
    const children = next();
    if (mode === 'display') return children;

    const isPlaceholderVisible = editor.isEmptyParagraph();
    return (
      <>
        {children}
        <CompositionMenuButton editor={editor} ref={menuRef} />
        <CompositionMenuPlaceholder isVisible={isPlaceholderVisible} />
      </>
    );
  }

  /* **** Hotkeys for selecting menu items **** */
  /* Only forward the keyboard event if the menu is open */

  function propagateKeyDown(key, editor, next, event) {
    const menu = menuRef.current;
    if (!menu) return next();

    const rect = menu.getBoundingClientRect();
    if (!rect.width && !rect.height) return next(); // means menu is not open

    event.preventDefault();
    const keyboardEvent = new KeyboardEvent('keydown', { key });
    return menu.dispatchEvent(keyboardEvent);
  }

  const hotkeys = [
    Hotkey('down', (...args) => propagateKeyDown('ArrowDown', ...args)),
    Hotkey('up', (...args) => propagateKeyDown('ArrowUp', ...args)),
    Hotkey('Enter', (...args) => propagateKeyDown('Enter', ...args)),
    Hotkey('Esc', (...args) => propagateKeyDown('Esc', ...args)),
  ];

  return [
    AddQueries({ isSlashCommand }),
    RenderEditor(displayMenu),
    hotkeys,
  ];
}

export default CompositionMenu;
