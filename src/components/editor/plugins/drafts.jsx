/* eslint react/prop-types: 0 */
import React from 'react';

import DraftSavedIndicator from '../drafts/DraftSavedIndicator';
import { RenderEditor } from './helpers';

function Drafts() {
  /* **** Render the indicator, and pass the editor ref to it **** */
  function displayDraftsIndicator(props, editor, next) {
    const { isDraftSaved, isSubmitting, mode, onSaveDraft } = props;
    const children = next();
    if (mode !== 'compose') return children;

    return (
      <>
        {children}
        <DraftSavedIndicator
          editor={editor}
          isDraftSaved={isDraftSaved}
          isSubmitting={isSubmitting}
          onSaveDraft={onSaveDraft}
        />
      </>
    );
  }

  return RenderEditor(displayDraftsIndicator);
}

export default Drafts;
