import { useEffect, useState } from 'react';

import { DEFAULT_ELEMENT } from 'components/editor/utils';

/*
 * Manages the state for a Slate composer component.
 *
 * Updates the state value if the initial content has changed.
 */
const useContentState = ({ resourceId: initialResourceId, initialContent }) => {
  const [resourceId, setResourceId] = useState(initialResourceId);
  const [content, setContent] = useState(
    initialContent ? JSON.parse(initialContent) : DEFAULT_ELEMENT
  );

  useEffect(() => {
    if (resourceId && resourceId !== initialResourceId) {
      setResourceId(initialResourceId);
      setContent(initialContent ? JSON.parse(initialContent) : DEFAULT_ELEMENT);
    }
  }, [resourceId, initialResourceId, initialContent]);

  return {
    content,

    // For spreading into input elements, such as <Slate /> provider components
    value: content,
    onChange: c => setContent(c),
  };
};

export default useContentState;
