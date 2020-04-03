import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import camelcaseKeys from 'camelcase-keys';

import {
  PUSHER_SUBSCRIPTION_SUCCESS_EVENT,
  NEW_DOCUMENT_OPERATION_EVENT,
} from 'utils/constants';
import { DocumentContext } from 'utils/contexts';
import initPusher from 'utils/pusher';

import Editor from 'components/editor/Editor';

const MINIMUM_SEND_INTERVAL = 500;

/*
 * Flushes any pending operations via Pusher on every tick of the event loop.
 */
const useDocumentPusher = editor => {
  // Helps distinguish remote vs. local editor operations
  const remoteRef = useRef(false);
  const readyRef = useRef(false);

  const { documentId, channelId } = useContext(DocumentContext);
  const [pendingOperations, setPendingOperations] = useState([]);
  const [lastSend, setLastSend] = useState(null);
  const channel = useMemo(() => initPusher(channelId).channel, [channelId]);

  useEffect(() => {
    const handleReadyState = () => {
      readyRef.current = true;
    };

    const receiveOperations = data => {
      const camelData = camelcaseKeys(data, { deep: true });
      const { documentId: targetDocumentId, operations } = camelData;

      if (documentId === targetDocumentId) {
        remoteRef.current = true;
        Editor.withoutNormalizing(editor, () => {
          operations.forEach(op => editor.apply(op));
        });
      }
    };

    channel.bind(NEW_DOCUMENT_OPERATION_EVENT, receiveOperations);
    channel.bind(PUSHER_SUBSCRIPTION_SUCCESS_EVENT, handleReadyState);

    return () => {
      channel.unbind(NEW_DOCUMENT_OPERATION_EVENT, receiveOperations);
      channel.unbind(PUSHER_SUBSCRIPTION_SUCCESS_EVENT, handleReadyState);
    };
  }, [channel, documentId, editor]);

  const sendOperations = () => {
    if (!readyRef.current || remoteRef.current) return;

    const now = Date.now();
    const interval = now - lastSend;
    if (lastSend && interval < MINIMUM_SEND_INTERVAL) return;

    setLastSend(now);
    const triggered = channel.trigger(NEW_DOCUMENT_OPERATION_EVENT, {
      operations: pendingOperations,
      documentId,
    });

    if (triggered) setPendingOperations([]);
  };

  if (pendingOperations.length) sendOperations();

  // Any users of this hook need to invoke this function during editor onChange()
  return () => {
    const operations = editor.operations.filter(
      o => o && o.type !== 'set_selection'
    );

    if (operations.length) setPendingOperations(old => [...old, ...operations]);
  };
};

export default useDocumentPusher;
