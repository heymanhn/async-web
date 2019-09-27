/* eslint react/prop-types: 0 */
import React from 'react';

import EditorActionsRow from '../EditorActionsRow';
import { RenderEditor } from './helpers';

function EditorActions() {
  function displayActions(props, editor, next) {
    const {
      forceDisableSubmit,
      handleCancel,
      handleSubmit,
      isSubmitting,
      mode,
    } = props;
    const children = next();
    if (mode === 'display') return children;

    return (
      <>
        {children}
        <EditorActionsRow
          isSubmitting={isSubmitting}
          isSubmitDisabled={editor.isEmptyDocument() || forceDisableSubmit}
          mode={mode}
          onCancel={handleCancel}
          onFileUploaded={editor.insertImage}
          onSubmit={handleSubmit}
        />
      </>
    );
  }

  return [RenderEditor(displayActions)];
}

export default EditorActions;
