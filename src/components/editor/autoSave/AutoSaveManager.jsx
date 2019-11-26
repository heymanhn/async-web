/*
 * Re-purposed from <DraftSavedIndicator />. We could DRY this up in the future
 * if needed.
 */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const DEBOUNCE_INTERVAL = 1000;
const IDLE_INTERVAL = 2000;

const AutoSaveManager = ({ editor, onSubmit }) => {
  const currentContents = JSON.stringify(editor.value.toJSON());
  const [state, setState] = useState({
    contents: currentContents,
    isTyping: false,
    timerStarted: false,
    timer: null,
  });

  function handleAutoSave(contents) {
    const { value } = editor;
    const payload = JSON.stringify(value.toJSON());

    if (payload === contents) onSubmit();

    return setState(oldState => ({
      ...oldState,
      contents: payload,
      isTyping: false,
      timer: null,
    }));
  }

  function handleTrackTyping(contents) {
    const { value } = editor;
    const newContents = JSON.stringify(value.toJSON());

    let timer;
    if (newContents !== contents) {
      timer = setTimeout(() => handleTrackTyping(newContents), DEBOUNCE_INTERVAL);
    } else {
      timer = setTimeout(() => handleAutoSave(contents), IDLE_INTERVAL);
    }

    setState(oldState => ({ ...oldState, timer }));
  }

  const { contents, isTyping, timer } = state;
  useEffect(() => (() => clearTimeout(timer)), [timer]);

  if (currentContents !== contents && !isTyping) {
    setState(oldState => ({ ...oldState, isTyping: true }));
    handleTrackTyping(contents);
  }

  return null;
};

AutoSaveManager.propTypes = {
  editor: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AutoSaveManager;
