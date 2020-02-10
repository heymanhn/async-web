/* eslint react/prop-types: 0 */
import React from 'react';

import CompositionMenuButton from '../compositionMenu/CompositionMenuButton';
import { DEFAULT_NODE } from '../utils';
import { AddQueries, Hotkey, RenderEditor } from './helpers';

function CompositionMenu({ isModal } = {}) {
  // This ref is forwarded down to the <CompositionMenu /> component
  const menuRef = React.createRef();

  /* **** Render the menu **** */
  function displayMenu(props, editor, next) {
    const { mode } = props;
    const children = next();
    if (mode === 'display') return children;

    return (
      <>
        {children}
        <CompositionMenuButton
          editor={editor}
          isModal={!!isModal}
          ref={menuRef}
        />
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

  return [AddQueries({ isSlashCommand }), RenderEditor(displayMenu), hotkeys];
}

export default CompositionMenu;
