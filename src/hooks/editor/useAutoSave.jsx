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
    timer: null,
  });

  const handleAutoSave = oldContent => {
    const newContent = contentStringRef.current;

    // This can be counterintuitive. When this function is invoked we
    // know the content has changed, but we only proceed with the save if the
    // user hasn't changed the content for a given idle interval.
    const readyToSave = !isDisabledRef.current && newContent === oldContent;

    if (readyToSave) {
      handleSave({ content: isJSON ? JSON.parse(newContent) : newContent });
    }

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

  /*
   * Need to make sure savedContent is always set to the initial value of a
   * given resource. This ensures that we only trigger saving when the
   * content has actually changed.
   *
   * Also: not using contentString as a dependency so that the effect hook
   * doesn't keep clearing the timers on unmount
   */
  useEffect(() => {
    const newContent = contentStringRef.current;
    if (isDisabled && newContent !== savedContent) {
      setState(oldState => ({
        ...oldState,
        savedContent: newContent,
        isTyping: false,
        timer: null,
      }));
    }

    return () => clearTimeout(timer);
  }, [timer, isDisabled, savedContent]);

  if (!isDisabled && contentString !== savedContent && !isTyping) {
    setState(oldState => ({ ...oldState, isTyping: true }));

    // First invocation needs to pass the previously saved content
    // so that the function sets the timer properly
    handleTrackTyping(savedContent);
  }
};

export default useAutoSave;
