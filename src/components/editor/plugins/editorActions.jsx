/* eslint react/prop-types: 0 */
import React from 'react';
import { isHotkey } from 'is-hotkey';
import Plain from 'slate-plain-serializer';

import EditorActionsRow from '../EditorActionsRow';
import { RenderEditor } from './helpers';

// Need to define this separate component so that React would let me use Hooks
function EditorActionsManager({ children, editor, editorProps: props }) {
  const {
    clearEditorValue,
    forceDisableSubmit,
    isPlainText,
    isSubmitting,
    loadInitialValue,
    mode,
    onCancel,
    onSubmit,
    value,
  } = props;
  const isValueEmpty = !Plain.serialize(value);

  function handleCancel({ saved = false } = {}) {
    if (mode === 'edit' && !saved) loadInitialValue();
    onCancel();
  }

  // This method abstracts the nitty gritty of preparing SlateJS data for persistence.
  // Parent components give us a method to perform the mutation; we give them the data to persist.
  async function handleSubmit() {
    if (isValueEmpty) return;

    const text = Plain.serialize(value);
    const payload = JSON.stringify(value.toJSON());

    const { isNewDiscussion } = await onSubmit({ text, payload });

    if (isNewDiscussion) return;
    if (mode === 'compose' && !isPlainText) clearEditorValue();
    handleCancel({ saved: true });
  }

  function handleKeyDown(event) {
    event.preventDefault();

    const hotkeys = {
      isSubmit: isHotkey('mod+Enter'),
      isCancel: isHotkey('Esc'),
    };

    if (hotkeys.isSubmit(event)) handleSubmit();
    if (hotkeys.isCancel(event) && isValueEmpty) handleCancel();
  }

  return (
    <>
      {children}
      <EditorActionsRow
        isSubmitting={isSubmitting}
        isSubmitDisabled={isValueEmpty || forceDisableSubmit}
        mode={mode}
        onCancel={handleCancel}
        onKeyDown={handleKeyDown}
        onFileUploaded={editor.insertImage}
        onSubmit={handleSubmit}
      />
    </>
  );
}

function EditorActions() {
  function displayActions(props, editor, next) {
    const { mode } = props;
    const children = next();
    if (mode === 'display') return children;

    return (
      <EditorActionsManager
        editor={editor}
        editorProps={props}
      >
        {children}
      </EditorActionsManager>
    );
  }

  return [RenderEditor(displayActions)];
}

export default EditorActions;
