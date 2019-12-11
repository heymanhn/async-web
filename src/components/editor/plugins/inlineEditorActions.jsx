/* eslint react/prop-types: 0 */
import React from 'react';

import InlineEditorActionsRow from '../InlineEditorActionsRow';
import { RenderEditor } from './helpers';

function InlineEditorActions() {
  function displayActions(props, editor, next) {
    const {
      forceDisableSubmit,
      handleCancel,
      handleSubmit,
      isDraftSaved,
      isSubmitting,
      mode,
      onDiscardDraft,
    } = props;
    const children = next();
    if (mode === 'display') return children;

    return (
      <>
        {children}
        <InlineEditorActionsRow
          isDraftSaved={isDraftSaved}
          isSubmitting={isSubmitting}
          isSubmitDisabled={editor.isEmptyDocument() || forceDisableSubmit}
          mode={mode}
          onCancel={handleCancel}
          onDiscardDraft={onDiscardDraft}
          onSubmit={handleSubmit}
        />
      </>
    );
  }

  return [RenderEditor(displayActions)];
}

export default InlineEditorActions;
