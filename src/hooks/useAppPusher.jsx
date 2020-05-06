import { useEffect } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import camelcaseKeys from 'camelcase-keys';
import Pluralize from 'pluralize';

import localAddNewMsgMutation from 'graphql/mutations/local/addNewMessageToDiscussionMessages';
import localAddNewPendingMessage from 'graphql/mutations/local/addNewPendingMessage';
import localUpdateNotificationMutation from 'graphql/mutations/local/updateNotification';
import localUpdateBadgeCountMutation from 'graphql/mutations/local/updateBadgeCount';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import documentQuery from 'graphql/queries/document';
import messageQuery from 'graphql/queries/message';
import { getLocalUser } from 'utils/auth';

import {
  NEW_MESSAGE_EVENT,
  NEW_THREAD_EVENT,
  DOCUMENT_ACCESS_EVENT,
  DISCUSSION_ACCESS_EVENT,
  BADGE_COUNT_EVENT,
  PUSHER_CHANNEL_PREFIX,
} from 'utils/constants';
import { isResourceOpen } from 'utils/helpers';

const useAppPusher = pusher => {
  const { userId } = getLocalUser();
  const client = useApolloClient(); // Workaround for the exhaustive-deps warnings
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
      const { parentId, workspaceId } = notification;

      [
        { resourceType: 'user', resourceId: userId },
        { resourceType: 'workspace', resourceId: workspaceId },
        { resourceType: 'document', resourceId: parentId },
        { resourceType: 'discussion', resourceId: parentId },
      ].forEach(item => {
        if (item.resourceId) {
          client.mutate({
            mutation: localUpdateNotificationMutation,
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

      if (isResourceOpen(discussionId)) {
        client.mutate({
          mutation: localAddNewPendingMessage,
          variables: { message },
        });
      }

      client.mutate({
        mutation: localAddNewMsgMutation,
        variables: {
          isUnread: true,
          message,
        },
      });
    };

    const handleNewThread = pusherData => {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { notification } = camelData;
      const { payload } = notification;
      const camelPayload = camelcaseKeys(JSON.parse(payload));
      const { contentParentId, contentParentType, discussionId } = camelPayload;

      if (contentParentType === 'message') {
        client.query({
          query: messageQuery,
          variables: { messageId: contentParentId },
        });

        client.query({
          query: discussionMessagesQuery,
          variables: { discussionId, queryParams: {} },
        });
      }

      if (contentParentType === 'document') {
        client.query({
          query: documentQuery,
          variables: { documentId: contentParentId },
        });
      }
    };

    channel.bind(BADGE_COUNT_EVENT, handleBadgeCount);
    channel.bind(NEW_MESSAGE_EVENT, handleNewMessage);
    channel.bind(NEW_THREAD_EVENT, handleNewThread);
    channel.bind(DOCUMENT_ACCESS_EVENT, handleNewNotification);
    channel.bind(DISCUSSION_ACCESS_EVENT, handleNewNotification);

    return () => {
      channel.unbind(BADGE_COUNT_EVENT, handleBadgeCount);
      channel.unbind(NEW_MESSAGE_EVENT, handleNewMessage);
      channel.unbind(NEW_THREAD_EVENT, handleNewThread);
      channel.unbind(DOCUMENT_ACCESS_EVENT, handleNewNotification);
      channel.unbind(DISCUSSION_ACCESS_EVENT, handleNewNotification);
    };
  }, [channel, client, userId]);

  return { pusher };
};

export default useAppPusher;
