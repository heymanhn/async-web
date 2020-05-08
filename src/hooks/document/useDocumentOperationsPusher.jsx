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
  const [channel, setChannel] = useState(null);
  const [pendingOperations, setPendingOperations] = useState([]);
  const [lastSend, setLastSend] = useState(null);
  const channelName = `${PUSHER_CHANNEL_PREFIX}-${channelId}`;
  const setLastTouchedToNowCb = useCallback(setLastTouchedToNow, []);

  // This hook will only be triggered when a new channel name is produced.
  // This only happens when the channel ID has changed, or when the hook is
  // mounted for the first time.
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

    const newChannel = pusher.subscribe(channelName);
    newChannel.bind(PUSHER_SUBSCRIPTION_SUCCESS_EVENT, handleReadyState);
    newChannel.bind(NEW_DOCUMENT_OPERATION_EVENT, processOperations);
    setChannel(newChannel);

    return () => {
      newChannel.unbind(PUSHER_SUBSCRIPTION_SUCCESS_EVENT, handleReadyState);
      newChannel.unbind(NEW_DOCUMENT_OPERATION_EVENT, processOperations);

      pusher.unsubscribe(channelName);
      setChannel(null);
    };
  }, [channelName, editor, setLastTouchedToNowCb, pusher]);

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
