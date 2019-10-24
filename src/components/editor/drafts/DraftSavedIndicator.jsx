import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Plain from 'slate-plain-serializer';
import styled from '@emotion/styled';

const DEBOUNCE_INTERVAL = 1000;
const IDLE_INTERVAL = 2000;
const INDICATOR_DURATION = 8000;

const Label = styled.div(({ theme: { colors } }) => ({
  position: 'absolute',
  alignSelf: 'flex-end',
  color: colors.grey6,
  fontSize: '14px',
  fontWeight: 500,
  marginTop: '-27px', // hardcoding the position for now
}));

const DraftSavedIndicator = ({ editor, onSaveDraft }) => {
  const currentContents = JSON.stringify(editor.value.toJSON());
  const [state, setState] = useState({
    contents: currentContents,
    isDraftSaved: false,
    isTyping: false,
    timerStarted: false,
  });

  async function handleSaveDraft(contents) {
    const { value } = editor;
    const text = Plain.serialize(value);
    const payload = JSON.stringify(value.toJSON());

    if (payload !== contents) return setState(oldState => ({ ...oldState, isTyping: false }));

    await onSaveDraft({ text, payload });

    setState(oldState => ({
      ...oldState,
      contents: payload,
      isTyping: false,
      isDraftSaved: true,
    }));

    setTimeout(
      () => setState(oldState => ({ ...oldState, isDraftSaved: false })),
      INDICATOR_DURATION,
    );

    return null;
  }

  function handleTrackTyping(contents) {
    const { value } = editor;
    const newContents = JSON.stringify(value.toJSON());

    if (newContents !== contents) {
      setTimeout(() => handleTrackTyping(newContents), DEBOUNCE_INTERVAL);
    } else {
      setTimeout(() => handleSaveDraft(contents), IDLE_INTERVAL);
    }
  }

  const { contents, isDraftSaved, isTyping } = state;
  if (currentContents !== contents && !isTyping) {
    setState(oldState => ({ ...oldState, isTyping: true }));
    handleTrackTyping(contents);
  }

  return isDraftSaved ? <Label>Draft saved</Label> : null;
};

DraftSavedIndicator.propTypes = {
  editor: PropTypes.object.isRequired,
  onSaveDraft: PropTypes.func.isRequired,
};

export default DraftSavedIndicator;
