/*
 * Manages the state for a Slate composer component.
 *
 * Updates the state value if the initial content has changed.
 */

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

import { getLocalUser } from 'utils/auth';

import { DEFAULT_ELEMENT } from 'components/editor/utils';

const {
  REACT_APP_ASYNC_API_URL,
  REACT_APP_PUSHER_APP_KEY,
  REACT_APP_PUSHER_APP_CLUSTER,
} = process.env;

const useContentState = ({
  editor,
  resourceType,
  resourceId: initialResourceId,
  initialContent,
} = {}) => {
  const [resourceId, setResourceId] = useState(initialResourceId);
  const [content, setContent] = useState(
    initialContent ? JSON.parse(initialContent) : DEFAULT_ELEMENT()
  );
  const [pendingOperations, setPendingOperations] = useState([]);

  useEffect(() => {
    if (resourceId && resourceId !== initialResourceId) {
      setResourceId(initialResourceId);
      setContent(
        initialContent ? JSON.parse(initialContent) : DEFAULT_ELEMENT()
      );
    }
  }, [resourceId, initialResourceId, initialContent]);

  useEffect(() => {
    if (!pendingOperations.length) return () => {};

    // TODO (HN): DRY this up with the other Pusher code later
    const { userId } = getLocalUser();
    const pusher = new Pusher(REACT_APP_PUSHER_APP_KEY, {
      authEndpoint: `${REACT_APP_ASYNC_API_URL}/pusher/auth`,
      cluster: REACT_APP_PUSHER_APP_CLUSTER,
      useTLS: true,
    });

    const channel = pusher.subscribe(`private-channel-${userId}`);
    const sendOperations = () => {
      const triggered = channel.trigger('client-new-document-operations', {
        operations: pendingOperations,
        documentId: resourceId,
      });

      if (triggered) setPendingOperations([]);
    };

    channel.bind('pusher:subscription_succeeded', sendOperations);
    return () => {
      channel.unbind('pusher:subscription_succeeded', sendOperations);
    };
  }, [pendingOperations, resourceId]);

  const handleChange = value => {
    setContent(value);

    if (resourceType !== 'document' || !editor) return;

    const operations = editor.operations.filter(
      o => o && o.type !== 'set_selection'
    );
    // .map(o => ({ ...o, data: { source: localEditorId.current } }));
    setPendingOperations(old => [...old, ...operations]);
  };

  return {
    content,

    // For spreading into input elements, such as <Slate /> provider components
    value: content,
    onChange: handleChange,
  };
};

export default useContentState;
