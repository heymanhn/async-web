/*
 * Contains all the state for Threads that callers need to keep track of.
 *
 * Usage: Spread the props into the <ThreadModal /> component.
 */
import { useEffect, useState } from 'react';

const useThreadState = initialThreadId => {
  const [state, setState] = useState({
    threadId: initialThreadId,
    initialTopic: null,
    sourceEditor: null,
  });

  // TODO (DISCUSSION V2): If a thread is loaded directly via URL, make sure
  // that deleting/updating the thread will also remove the annotation properly.
  useEffect(() => {
    setState(old => ({ ...old, threadId: initialThreadId }));
  }, [initialThreadId]);

  const handleShowThread = ({
    threadId,
    initialTopic = null,
    sourceEditor = null, // So that the thread can update/remove the annotation
  }) => {
    setState(oldState => ({
      ...oldState,
      threadId,
      initialTopic,
      sourceEditor,
    }));
  };

  const handleCloseThread = () => {
    setState(oldState => ({
      ...oldState,
      threadId: null,
      initialTopic: null,
      sourceEditor: null,
    }));
  };

  return {
    ...state,

    handleShowThread,
    handleCloseThread,
  };
};

export default useThreadState;
