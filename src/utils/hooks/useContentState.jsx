import { useCallback, useEffect, useState } from 'react';

import {
  DEFAULT_ELEMENT,
  deserializeString,
  toPlainText,
} from 'components/editor/utils';

/*
 * Manages the state for a Slate composer component.
 *
 * Updates the state value if the initial content has changed.
 */
const useContentState = (initialContent, { isJSON = true } = {}) => {
  const formatContent = useCallback(
    c => (isJSON ? JSON.parse(c) : deserializeString(c)),
    [isJSON]
  );

  const [content, setContent] = useState(
    initialContent ? formatContent(initialContent) : DEFAULT_ELEMENT
  );

  useEffect(() => {
    if (initialContent) setContent(formatContent(initialContent));
  }, [initialContent, formatContent]);

  return {
    content: isJSON ? content : toPlainText(content),

    // For spreading into <Slate /> provider components
    value: content,
    onChange: c => setContent(c),
  };
};

export default useContentState;
