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
  const { items, __typename } = resourceNotifications;
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
        notifications: notificationsData,
        __typename,
      },
    },
  });

  return null;
};

const markNotificationAsRead = (_root, { objectId }, { client }) => {
  const notification = client.readFragment({
    id: objectId,
    fragment: notificationFragment,
  });

  if (!notification) return null;

  client.writeFragment({
    id: objectId,
    fragment: notificationFragment,
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
