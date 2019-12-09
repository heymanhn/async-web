/* eslint react/prop-types: 0 */
import React from 'react';

import { RenderEditor } from './helpers';
import Toolbar from '../toolbar/Toolbar';

function SelectionToolbar() {
  function displayToolbar(props, editor, next) {
    const { isMouseDown, mode, value } = props;
    const { selection } = value;
    const isOpen = selection.isExpanded && !isMouseDown;
    const children = next();

    return (
      <>
        {children}
        <Toolbar
          editor={editor}
          editorProps={props}
          isOpen={isOpen}
          mode={mode}
        />
      </>
    );
  }

  return [RenderEditor(displayToolbar)];
}

export default SelectionToolbar;
