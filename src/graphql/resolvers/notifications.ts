import notificationFragment from 'graphql/fragments/notification';
import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';

const updateNotification = (
  _root,
  { resourceType, resourceId, notification },
  { client }
) => {
  const data = client.readQuery({
    query: resourceNotificationsQuery,
    variables: { resourceType, resourceId, queryParams: {} },
  });

  if (!data) return null;

  const { resourceNotifications } = data;
  const { items, pageToken, __typename } = resourceNotifications;
  const safeNotifications = items || [notification];
  const index = safeNotifications.findIndex(
    n => n.objectId === notification.objectId
  );
  const newNotification = {
    __typename: safeNotifications[0].__typename,
    ...notification,
    author: {
      __typename: safeNotifications[0].author.__typename,
      ...notification.author,
    },
  };

  const notificationsData =
    index < 0
      ? [newNotification, ...safeNotifications]
      : [
          newNotification,
          ...safeNotifications.slice(0, index),
          ...safeNotifications.slice(index + 1),
        ];

  client.writeQuery({
    query: resourceNotificationsQuery,
    variables: { resourceType, resourceId, queryParams: {} },
    data: {
      resourceNotifications: {
        items: notificationsData,
        pageToken,
        __typename,
      },
    },
  });

  return null;
};

const markNotificationAsRead = (_root, { objectId }, { client }) => {
  // Need to specify the fragment name if the fragment contains nested fragments
  // https://github.com/apollographql/apollo-client/issues/2902
  const notification = client.readFragment({
    id: objectId,
    fragment: notificationFragment,
    fragmentName: 'NotificationObject',
  });

  if (!notification) return null;

  client.writeFragment({
    id: objectId,
    fragment: notificationFragment,
    fragmentName: 'NotificationObject',
    data: {
      ...notification,
      readAt: Date.now(),
    },
  });

  return null;
};

export default {
  updateNotification,
  markNotificationAsRead,
};
