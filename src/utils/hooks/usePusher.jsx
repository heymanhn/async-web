import { useEffect } from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import Pusher from 'pusher-js';
import camelcaseKeys from 'camelcase-keys';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import addNewPendingMessage from 'graphql/mutations/local/addNewPendingMessage';
import updateNotificationMutation from 'graphql/mutations/local/updateNotifications';
import addNewMsgMutation from 'graphql/mutations/local/addNewMessageToDiscussionMessages';

import { getLocalUser } from 'utils/auth';
import { isDiscussionOpen } from 'utils/helpers';
import {
  NEW_MESSAGE_EVENT,
  DOCUMENT_ACCESS_EVENT,
  DISCUSSION_ACCESS_EVENT,
  BADGE_COUNT_EVENT,
} from 'utils/constants';

const {
  REACT_APP_ASYNC_API_URL,
  REACT_APP_PUSHER_APP_KEY,
  REACT_APP_PUSHER_APP_CLUSTER,
} = process.env;

const usePusher = () => {
  const client = useApolloClient(); // Workaround for the exhaustive-deps warnings
  const { data: isLoggedInData } = useQuery(isLoggedInQuery);

  useEffect(() => {
    if (!isLoggedInData || !isLoggedInData.isLoggedIn) return () => {};
    const { userId } = getLocalUser();

    const pusher = new Pusher(REACT_APP_PUSHER_APP_KEY, {
      authEndpoint: `${REACT_APP_ASYNC_API_URL}/pusher/auth`,
      cluster: REACT_APP_PUSHER_APP_CLUSTER,
      useTLS: true,
    });

    const channelName = `private-channel-${userId}`;
    const channel = pusher.subscribe(channelName);

    const handleBadgeCount = pusherData => {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { resourceType, resourceId, incrementBy } = camelData;

      client.mutate({
        mutation: updateNotificationMutation,
        variables: { resourceType, resourceId, incrementBy },
      });
    };

    const handleNewNotification = pusherData => {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { notification } = camelData;

      client.mutate({
        mutation: updateNotificationMutation,
        variables: { userId, notification },
      });
    };

    const handleNewMessage = pusherData => {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { message, notification } = camelData;
      const { discussionId } = message;

      if (notification) {
        client.mutate({
          mutation: updateNotificationMutation,
          variables: { userId, notification },
        });
      }

      if (isDiscussionOpen(discussionId)) {
        client.mutate({
          mutation: addNewPendingMessage,
          variables: { message },
        });
      } else {
        client.mutate({
          mutation: addNewMsgMutation,
          variables: {
            isUnread: true,
            message,
          },
        });
      }
    };

    channel.bind(BADGE_COUNT_EVENT, handleBadgeCount);
    channel.bind(NEW_MESSAGE_EVENT, handleNewMessage);
    channel.bind(DOCUMENT_ACCESS_EVENT, handleNewNotification);
    channel.bind(DISCUSSION_ACCESS_EVENT, handleNewNotification);

    return () => {
      channel.unbind(BADGE_COUNT_EVENT, handleBadgeCount);
      channel.unbind(NEW_MESSAGE_EVENT, handleNewMessage);
      channel.unbind(DOCUMENT_ACCESS_EVENT, handleNewNotification);
      channel.unbind(DISCUSSION_ACCESS_EVENT, handleNewNotification);
    };
  }, [isLoggedInData, client]);
};

export default usePusher;
