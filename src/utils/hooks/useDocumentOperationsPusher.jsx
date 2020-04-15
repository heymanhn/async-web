import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { HistoryEditor } from 'slate-history';

import {
  PUSHER_SUBSCRIPTION_SUCCESS_EVENT,
  NEW_DOCUMENT_OPERATION_EVENT,
  MINIMUM_PUSHER_SEND_INTERVAL,
  PUSHER_CHANNEL_PREFIX,
} from 'utils/constants';
import { AppContext, DocumentContext } from 'utils/contexts';

import Editor from 'components/editor/Editor';

const useDocumentOperationsPusher = (editor, setLastTouchedToNow) => {
  /*
   * Why use refs? As an escape hatch from having to pass boolean state variables
   * to the useEffect hook :-)
   */
  const pusherReadyRef = useRef(false);

  const { channelId } = useContext(DocumentContext);
  const { pusher } = useContext(AppContext);
  const [pendingOperations, setPendingOperations] = useState([]);
  const [lastSend, setLastSend] = useState(null);
  const channelName = `${PUSHER_CHANNEL_PREFIX}-${channelId}`;
  const channel = pusher.subscribe(channelName);
  const setLastTouchedToNowCb = useCallback(setLastTouchedToNow, []);

  useEffect(() => {
    const handleReadyState = () => {
      pusherReadyRef.current = true;
    };

    const processOperations = data => {
      const { operations } = data;

      HistoryEditor.withoutSaving(editor, () => {
        Editor.withoutNormalizing(editor, () => {
          operations.forEach(op => editor.apply({ ...op, isRemote: true }));
        });
      });

      // Edits by other users should be considered touching the document
      setLastTouchedToNowCb();
    };

    channel.bind(PUSHER_SUBSCRIPTION_SUCCESS_EVENT, handleReadyState);
    channel.bind(NEW_DOCUMENT_OPERATION_EVENT, processOperations);

    return () => {
      channel.unbind(PUSHER_SUBSCRIPTION_SUCCESS_EVENT, handleReadyState);
      channel.unbind(NEW_DOCUMENT_OPERATION_EVENT, processOperations);
    };
  }, [channel, editor, setLastTouchedToNowCb]);

  const sendOperations = () => {
    if (!pusherReadyRef.current) return;

    const now = Date.now();
    const interval = now - lastSend;
    if (lastSend && interval < MINIMUM_PUSHER_SEND_INTERVAL) return;

    setLastSend(now);
    const triggered = channel.trigger(NEW_DOCUMENT_OPERATION_EVENT, {
      operations: pendingOperations,
    });

    if (triggered) setPendingOperations([]);
  };

  if (pendingOperations.length) sendOperations();

  // Any users of this hook need to invoke this function during editor onChange()
  return () => {
    const operations = editor.operations.filter(
      o => o && !o.isRemote && o.type !== 'set_selection'
    );

    if (operations.length) setPendingOperations(old => [...old, ...operations]);
  };
};

export default useDocumentOperationsPusher;
