import { useEffect } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import camelcaseKeys from 'camelcase-keys';
import Pluralize from 'pluralize';

import addNewPendingMessage from 'graphql/mutations/local/addNewPendingMessage';
import localUpdateNotificationsMutation from 'graphql/mutations/local/updateNotifications';
import localUpdateBadgeCountMutation from 'graphql/mutations/local/updateBadgeCount';
import addNewMsgMutation from 'graphql/mutations/local/addNewMessageToDiscussionMessages';
import { getLocalUser } from 'utils/auth';

import {
  NEW_MESSAGE_EVENT,
  DOCUMENT_ACCESS_EVENT,
  DISCUSSION_ACCESS_EVENT,
  BADGE_COUNT_EVENT,
  PUSHER_CHANNEL_PREFIX,
} from 'utils/constants';
import { isDiscussionOpen } from 'utils/helpers';
import initPusher from 'utils/pusher';

const useAppPusher = () => {
  const { userId } = getLocalUser();
  const client = useApolloClient(); // Workaround for the exhaustive-deps warnings
  const { pusher } = initPusher();
  const channelName = `${PUSHER_CHANNEL_PREFIX}-${userId}`;
  const channel = pusher.subscribe(channelName);

  /*
   * TODO (HN): Consider moving some of these event listeners into a more
   * specific component, instead of doing this all on the App level.
   */
  useEffect(() => {
    const handleBadgeCount = pusherData => {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { resourceType, resourceId, incrementBy } = camelData;

      client.mutate({
        mutation: localUpdateBadgeCountMutation,
        variables: { resourceType, resourceId, incrementBy },
      });
    };

    const handleNewNotification = pusherData => {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { notification } = camelData;
      const { documentId, workspaceId } = notification;

      [
        { resourceType: 'user', resourceId: userId },
        { resourceType: 'workspace', resourceId: workspaceId },
        { resourceType: 'document', resourceId: documentId },
      ].forEach(item => {
        if (item.resourceId) {
          client.mutate({
            mutation: localUpdateNotificationsMutation,
            variables: {
              resourceType: Pluralize(item.resourceType),
              resourceId: item.resourceId,
              notification,
            },
          });
        }
      });
    };

    const handleNewMessage = pusherData => {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { message, notification } = camelData;
      const { discussionId } = message;

      if (notification) {
        handleNewNotification(pusherData);
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
  }, [channel, client, userId]);

  return { pusher };
};

export default useAppPusher;
