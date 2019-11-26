/* eslint react/prop-types: 0 */
import React from 'react';

import AutoSaveManager from '../autoSave/AutoSaveManager';
import { RenderEditor } from './helpers';

function AutoSave() {
  function autoSaveDetection(props, editor, next) {
    const { handleSubmit, mode } = props;
    const children = next();

    if (mode !== 'compose') return children;

    return (
      <>
        {children}
        <AutoSaveManager
          editor={editor}
          onSubmit={handleSubmit}
        />
      </>
    );
  }

  return RenderEditor(autoSaveDetection);
}

export default AutoSave;
