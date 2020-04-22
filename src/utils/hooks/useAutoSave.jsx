import { useEffect, useRef, useState } from 'react';

const DEBOUNCE_INTERVAL = 1000;
const IDLE_INTERVAL = 2000;

const useAutoSave = ({
  content,
  handleSave,
  isDisabled,
  isJSON = true,
} = {}) => {
  // See https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks
  const contentString = isJSON ? JSON.stringify(content) : content;
  const contentStringRef = useRef(contentString);
  const isDisabledRef = useRef(isDisabled);

  contentStringRef.current = contentString;
  isDisabledRef.current = isDisabled;

  const [state, setState] = useState({
    savedContent: contentString,
    isTyping: false,
    timerStarted: false,
    timer: null,
  });

  const handleAutoSave = oldContent => {
    const newContent = contentStringRef.current;

    // This can be counterintuitive. When this function is invoked we
    // know the content has changed, but we only proceed with the save if the
    // user hasn't changed the content for a given idle interval.
    const readyToSave = !isDisabledRef.current && newContent === oldContent;
    if (readyToSave) handleSave({ content: JSON.parse(newContent) });

    return setState(oldState => ({
      ...oldState,
      savedContent: readyToSave ? newContent : oldState.savedContent,
      isTyping: false,
      timer: null,
    }));
  };

  const handleTrackTyping = oldContent => {
    const newContent = contentStringRef.current;

    let timer;
    if (newContent !== oldContent) {
      timer = setTimeout(
        () => handleTrackTyping(newContent),
        DEBOUNCE_INTERVAL
      );
    } else {
      timer = setTimeout(() => handleAutoSave(newContent), IDLE_INTERVAL);
    }

    setState(oldState => ({ ...oldState, timer }));
  };

  const { savedContent, isTyping, timer } = state;
  useEffect(() => () => clearTimeout(timer), [timer]);

  if (!isDisabled && contentString !== savedContent && !isTyping) {
    setState(oldState => ({ ...oldState, isTyping: true }));

    // First invocation needs to pass the previously saved content
    // so that the function sets the timer properly
    handleTrackTyping(savedContent);
  }
};

export default useAutoSave;
