import { useEffect } from 'react';
import { useApolloClient, useQuery } from 'react-apollo';
import Pusher from 'pusher-js';
import camelcaseKeys from 'camelcase-keys';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import addNewPendingMessage from 'graphql/mutations/local/addNewPendingMessage';
import updateBadgeCountMutation from 'graphql/mutations/local/updateBadgeCount';
import addNewMessageToDiscussion from 'graphql/mutations/local/addNewMessageToDiscussion';

import { getLocalUser } from 'utils/auth';
import { isDiscussionOpen } from 'utils/navigation';

const NEW_MESSAGE_EVENT = 'new_message';
const DOCUMENT_ACCESS_EVENT = 'document_access';
const DISCUSSION_ACCESS_EVENT = 'discussion_access';

const {
  REACT_APP_ASYNC_API_URL,
  REACT_APP_PUSHER_APP_KEY,
  REACT_APP_PUSHER_APP_CLUSTER,
} = process.env;

const usePusher = () => {
  const client = useApolloClient(); // Workaround for the exhaustive-deps warnings
  const { data: isLoggedInData } = useQuery(isLoggedInQuery);

  useEffect(() => {
    if (!isLoggedInData || !isLoggedInData.isLoggedIn) return undefined;
    const { userId } = getLocalUser();

    const pusher = new Pusher(REACT_APP_PUSHER_APP_KEY, {
      authEndpoint: `${REACT_APP_ASYNC_API_URL}/pusher/auth`,
      cluster: REACT_APP_PUSHER_APP_CLUSTER,
      useTLS: true,
    });

    const channelName = `private-channel-${userId}`;
    const channel = pusher.subscribe(channelName);

    function handleBadgeCount(pusherData) {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { notification } = camelData;

      client.mutate({
        mutation: updateBadgeCountMutation,
        variables: { userId, notification },
      });
    }

    function handleNewMessage(pusherData) {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { message } = camelData;
      const { discussionId } = message;

      if (isDiscussionOpen(discussionId)) {
        client.mutate({
          mutation: addNewPendingMessage,
          variables: { message },
        });
      } else {
        client.mutate({
          mutation: addNewMessageToDiscussion,
          variables: {
            isUnread: true,
            message,
          },
        });
      }
    }

    channel.bind(NEW_MESSAGE_EVENT, handleNewMessage);
    channel.bind(DOCUMENT_ACCESS_EVENT, handleBadgeCount);
    channel.bind(DISCUSSION_ACCESS_EVENT, handleBadgeCount);

    return () => {
      channel.unbind(NEW_MESSAGE_EVENT, handleNewMessage);
      channel.unbind(DOCUMENT_ACCESS_EVENT, handleBadgeCount);
      channel.unbind(DISCUSSION_ACCESS_EVENT, handleBadgeCount);
    };
  }, [isLoggedInData, client]);
};

export default usePusher;
