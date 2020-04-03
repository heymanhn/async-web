import { useEffect, useMemo, useRef, useState } from 'react';
import camelcaseKeys from 'camelcase-keys';

import {
  PUSHER_SUBSCRIPTION_SUCCESS_EVENT,
  NEW_DOCUMENT_OPERATION_EVENT,
} from 'utils/constants';
import initPusher from 'utils/pusher';

import Editor from 'components/editor/Editor';

/*
 * Flushes any pending operations via Pusher on every tick of the event loop.
 */
const useDocumentPusher = ({ documentId, editor }) => {
  // Helps distinguish remote vs. local editor operations
  const remoteRef = useRef(false);
  const readyRef = useRef(false);

  const [pendingOperations, setPendingOperations] = useState([]);
  const channel = useMemo(() => initPusher(documentId).channel, [documentId]);

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
    if (!readyRef.current || !pendingOperations.length) return;

    const triggered = channel.trigger(NEW_DOCUMENT_OPERATION_EVENT, {
      operations: pendingOperations,
      documentId,
    });

    if (triggered) setPendingOperations([]);
  };

  if (pendingOperations.length) sendOperations();

  // Any users of this hook need to invoke this function during editor onChange()
  return () => {
    if (remoteRef.current) {
      remoteRef.current = false;
      return;
    }

    const operations = editor.operations.filter(
      o => o && o.type !== 'set_selection'
    );

    if (operations.length) setPendingOperations(old => [...old, ...operations]);
  };
};

export default useDocumentPusher;