import { useContext, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/react-hooks';

import localUpdateDocumentTitleMtn from 'graphql/mutations/local/updateDocumentTitle';

import {
  PUSHER_SUBSCRIPTION_SUCCESS_EVENT,
  NEW_DOCUMENT_TITLE_EVENT,
  PUSHER_CHANNEL_PREFIX,
} from 'utils/constants';
import { AppContext, DocumentContext } from 'utils/contexts';

const useDocumentTitlePusher = () => {
  const pusherReadyRef = useRef(false);

  const { documentId, channelId } = useContext(DocumentContext);
  const { pusher } = useContext(AppContext);
  const channelName = `${PUSHER_CHANNEL_PREFIX}-${channelId}`;
  const channel = pusher.subscribe(channelName);

  const [localUpdateDocumentTitle] = useMutation(localUpdateDocumentTitleMtn, {
    variables: { documentId },
  });

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
