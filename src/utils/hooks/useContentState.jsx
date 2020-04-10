/*
 * Manages the state for a Slate composer component.
 *
 * Updates the state value if the initial content has changed.
 */

import { useEffect, useRef, useState } from 'react';

import { DEFAULT_ELEMENT } from 'components/editor/utils';

const RECENT_TOUCH_INTERVAL = 10000;
const DEBOUNCE_INTERVAL = 3000;

const useContentState = ({
  editor,
  resourceId: initialResourceId,
  initialContent,
} = {}) => {
  // Using a ref to avoid triggering the hooks when the lastTouched
  // state value changes.
  const [lastTouched, setLastTouched] = useState(null);
  const lastTouchedRef = useRef(lastTouched);
  lastTouchedRef.current = lastTouched;
  const setLastTouchedToNow = () => {
    const now = Date.now();
    if (now - lastTouchedRef.current > DEBOUNCE_INTERVAL) {
      setLastTouched(now);
    }
  };

  const [resourceId, setResourceId] = useState(initialResourceId);
  const [content, setContent] = useState(DEFAULT_ELEMENT());

  useEffect(() => {
    const resourceChanged = resourceId && resourceId !== initialResourceId;
    const recentlyTouched =
      lastTouchedRef.current &&
      Date.now() - lastTouchedRef.current < RECENT_TOUCH_INTERVAL;

    if (resourceChanged) setResourceId(initialResourceId);
    if (resourceChanged || !recentlyTouched) {
      setContent(
        initialContent ? JSON.parse(initialContent) : DEFAULT_ELEMENT()
      );
      setLastTouched(null);
    }
  }, [resourceId, initialResourceId, initialContent]);

  if (editor.operations.length) setLastTouchedToNow();

  return {
    content,
    setLastTouchedToNow,

    // For spreading into input elements, such as <Slate /> provider components
    value: content,
    onChange: c => setContent(c),
  };
};

export default useContentState;
