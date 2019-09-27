/* eslint react/prop-types: 0 */
import React from 'react';
import Plain from 'slate-plain-serializer';

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
      value,
    } = props;
    const children = next();
    if (mode === 'display') return children;

    const isValueEmpty = !Plain.serialize(value);
    return (
      <>
        {children}
        <EditorActionsRow
          isSubmitting={isSubmitting}
          isSubmitDisabled={isValueEmpty || forceDisableSubmit}
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
