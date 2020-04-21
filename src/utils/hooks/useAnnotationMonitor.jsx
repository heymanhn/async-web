/*
 * Saves the current content once an annotation is added/modified/removed.
 * Only enabled when the message is in display mode, a.k.a "read only"
 *
 * TODO (DISCUSSION V2): There may be a better way to monitor changes.
 * Find it later. Should we table this and work on discussion UI first?
 */
import { useState, useEffect } from 'react';

import useMessageMutations from 'utils/hooks/useMessageMutations';

const useAnnotationMonitor = (initialMessage, editor, readOnly) => {
  const { children, operations } = editor;
  const [message, setMessage] = useState(initialMessage);
  const { handleUpdate } = useMessageMutations({
    message: children,
  });

  useEffect(() => {
    setMessage(initialMessage);
  }, [initialMessage]);

  if (!readOnly) return;
  if (
    operations.length &&
    children.length &&
    JSON.stringify(children) !== JSON.stringify(message)
  ) {
    handleUpdate();
    setMessage(children);
  }
};

export default useAnnotationMonitor;
