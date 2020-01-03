import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Plain from 'slate-plain-serializer';
import styled from '@emotion/styled';

import useMountEffect from 'utils/hooks/useMountEffect';

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

const DraftSavedIndicator = ({ editor, isDraftSaved, isSubmitting, onSaveDraft }) => {
  const currentContents = JSON.stringify(editor.value.toJSON());
  const [state, setState] = useState({
    contents: currentContents,
    isTyping: false,
    showIndicator: isDraftSaved,
    timerStarted: false,
    timer: null,
  });

  // See https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks
  const isSubmittingRef = useRef(isSubmitting);
  isSubmittingRef.current = isSubmitting;

  function setDismissTimer() {
    const timer = setTimeout(
      () => setState(oldState => ({ ...oldState, showIndicator: false, timer: null })),
      INDICATOR_DURATION,
    );

    setState(oldState => ({ ...oldState, timer }));
  }

  async function handleSaveDraft(contents) {
    const { value } = editor;
    const text = Plain.serialize(value);
    const payload = JSON.stringify(value.toJSON());

    if (payload !== contents || isSubmittingRef.current) {
      return setState(oldState => ({ ...oldState, isTyping: false, timer: null }));
    }

    await onSaveDraft({ text, payload });

    setState(oldState => ({
      ...oldState,
      contents: payload,
      isTyping: false,
      showIndicator: true,
    }));

    return setDismissTimer();
  }

  function handleTrackTyping(contents) {
    if (isSubmittingRef.current) return;

    const { value } = editor;
    const newContents = JSON.stringify(value.toJSON());

    let timer;
    if (newContents !== contents) {
      timer = setTimeout(() => handleTrackTyping(newContents), DEBOUNCE_INTERVAL);
    } else {
      timer = setTimeout(() => handleSaveDraft(contents), IDLE_INTERVAL);
    }

    setState(oldState => ({ ...oldState, timer }));
  }

  const { contents, showIndicator, isTyping, timer } = state;
  useEffect(() => (() => clearTimeout(timer)), [timer]);

  // Show the indicator initially to remind users that this is a saved draft
  useMountEffect(() => {
    if (isDraftSaved && showIndicator) setDismissTimer();
  });

  if (currentContents !== contents && !isTyping) {
    setState(oldState => ({ ...oldState, isTyping: true }));
    handleTrackTyping(contents);
  }

  return showIndicator ? <Label>Draft saved</Label> : null;
};

DraftSavedIndicator.propTypes = {
  editor: PropTypes.object.isRequired,
  isDraftSaved: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onSaveDraft: PropTypes.func.isRequired,
};

export default DraftSavedIndicator;
