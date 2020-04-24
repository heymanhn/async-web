/*
 * Manages the state for a Slate composer component.
 *
 * Updates the state value if the initial content has changed.
 */

import { useEffect, useRef, useState } from 'react';
import throttle from 'lodash/throttle';

import useMessageMutations from 'hooks/message/useMessageMutations';
import { DEFAULT_ELEMENT } from 'utils/editor/constants';

const RECENT_TOUCH_INTERVAL = 10000;
const DEBOUNCE_INTERVAL = 3000;

const useContentState = ({
  editor,
  resourceId: initialResourceId,
  initialContent,
  readOnly,
} = {}) => {
  // TODO (DISCUSSION V2): Find a better way to do this, so that useContentState
  // doesn't make any assumptions about what resource this content is for.
  const { handleUpdateMessage } = useMessageMutations();

  // Using a ref to avoid triggering the hooks when the lastTouched
  // state value changes.
  const [lastTouched, setLastTouched] = useState(Date.now());
  const lastTouchedRef = useRef(lastTouched);
  lastTouchedRef.current = lastTouched;
  const setLastTouchedToNow = () => {
    const now = Date.now();
    if (now - lastTouchedRef.current > DEBOUNCE_INTERVAL) {
      setLastTouched(now);
    }
  };

  const [resourceId, setResourceId] = useState(initialResourceId);
  const [content, setContent] = useState(
    initialContent ? JSON.parse(initialContent) : DEFAULT_ELEMENT()
  );

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
    setContent,
    setLastTouchedToNow,

    // For spreading into input elements, such as <Slate /> provider components
    value: content,
    onChange: c => {
      // TODO (DISCUSSION V2): Is there any better way to do this?
      // Also, why does updating an annotation trigger onChange, but creating
      // the annotation doesn't? I'm confused.
      const throttledUpdateMessage = throttle(
        () => handleUpdateMessage({ newMessage: c }),
        1000
      );
      if (readOnly) throttledUpdateMessage();
      setContent(c);
    },
  };
};

export default useContentState;
