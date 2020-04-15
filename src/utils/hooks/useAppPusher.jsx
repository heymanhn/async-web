import { useEffect, useMemo } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import camelcaseKeys from 'camelcase-keys';
import Pluralize from 'pluralize';

import addNewPendingMessage from 'graphql/mutations/local/addNewPendingMessage';
import localUpdateNotificationMutation from 'graphql/mutations/local/updateNotification';
import localUpdateBadgeCountMutation from 'graphql/mutations/local/updateBadgeCount';
import addNewMsgMutation from 'graphql/mutations/local/addNewMessageToDiscussionMessages';
import { getLocalUser } from 'utils/auth';

import {
  NEW_MESSAGE_EVENT,
  DOCUMENT_ACCESS_EVENT,
  DISCUSSION_ACCESS_EVENT,
  BADGE_COUNT_EVENT,
} from 'utils/constants';
import { isDiscussionOpen } from 'utils/helpers';
import initPusher from 'utils/pusher';

const useAppPusher = () => {
  const client = useApolloClient(); // Workaround for the exhaustive-deps warnings
  const channel = useMemo(() => initPusher().channel, []);

  /*
   * TODO (HN): Consider moving some of these event listeners into a more
   * specific component, instead of doing this all on the App level.
   */
  useEffect(() => {
    const { userId } = getLocalUser();

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
  }, [channel, client]);
};

export default useAppPusher;
