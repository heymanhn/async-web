import { useEffect, useState } from 'react';

import { DEFAULT_ELEMENT } from 'components/editor/utils';

/*
 * Manages the state for a Slate composer component.
 *
 * Updates the state value if the initial content has changed.
 */
const useContentState = initialContent => {
  const [content, setContent] = useState(
    initialContent ? JSON.parse(initialContent) : DEFAULT_ELEMENT
  );

  useEffect(() => {
    setContent(initialContent ? JSON.parse(initialContent) : DEFAULT_ELEMENT);
  }, [initialContent]);

  return {
    content,

    // For spreading into input elements, such as <Slate /> provider components
    value: content,
    onChange: c => setContent(c),
  };
};

export default useContentState;
