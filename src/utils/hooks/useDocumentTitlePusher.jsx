import { useContext, useEffect, useMemo, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';

import localUpdateDocumentTitleMtn from 'graphql/mutations/local/updateDocumentTitle';

import {
  PUSHER_SUBSCRIPTION_SUCCESS_EVENT,
  NEW_DOCUMENT_TITLE_EVENT,
} from 'utils/constants';
import { DocumentContext } from 'utils/contexts';
import initPusher from 'utils/pusher';

const useDocumentTitlePusher = () => {
  /*
   * Why use refs? As an escape hatch from having to pass boolean state variables
   * to the useEffect hook :-)
   */
  const pusherReadyRef = useRef(false);

  const { documentId, channelId } = useContext(DocumentContext);
  const channel = useMemo(() => initPusher(channelId).channel, [channelId]);
  const [localUpdateDocumentTitle] = useMutation(localUpdateDocumentTitleMtn, {
    variables: { documentId },
  });
  // const updateDocumentTitleCb = useCallback()

  useEffect(() => {
    const handleReadyState = () => {
      pusherReadyRef.current = true;
    };

    const processNewTitle = data => {
      const { title } = data;

      localUpdateDocumentTitle({ variables: { title } });
    };

    channel.bind(PUSHER_SUBSCRIPTION_SUCCESS_EVENT, handleReadyState);
    channel.bind(NEW_DOCUMENT_TITLE_EVENT, processNewTitle);

    return () => {
      channel.unbind(PUSHER_SUBSCRIPTION_SUCCESS_EVENT, handleReadyState);
      channel.unbind(NEW_DOCUMENT_TITLE_EVENT, processNewTitle);
    };
  }, [channel, localUpdateDocumentTitle]);

  return title => {
    if (!pusherReadyRef.current) return;

    channel.trigger(NEW_DOCUMENT_TITLE_EVENT, { title });
  };
};

export default useDocumentTitlePusher;
