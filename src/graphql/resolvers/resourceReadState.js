import { WORKSPACES_QUERY_SIZE, RESOURCES_QUERY_SIZE } from 'utils/constants';
import { getLocalUser } from 'utils/auth';
import { snakedQueryParams } from 'utils/queryParams';

import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';
import workspacesQuery from 'graphql/queries/workspaces';
import workspaceResourcesQuery from 'graphql/queries/workspaceResources';
import resourcesQuery from 'graphql/queries/resources';

/*
 * Updates a notification object
 * TODO: use readFragment() / writeFragment()
 */
const updateNotifications = (
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

const updateWorkspaceBadgeCount = (userId, resourceId, incrementBy, client) => {
  const {
    workspaces: { pageToken, items, totalHits, __typename },
  } = client.readQuery({
    query: workspacesQuery,
    variables: {
      userId,
      queryParams: snakedQueryParams({ size: WORKSPACES_QUERY_SIZE }),
    },
  });

  const index = items.findIndex(i => i.workspace.id === resourceId);
  if (index < 0) return;

  const workspaceItem = items[index];
  const updatedWorkspaceItem = {
    ...workspaceItem,
    badgeCount: Math.max(workspaceItem.badgeCount + incrementBy, 0),
  };

  client.writeQuery({
    query: workspacesQuery,
    variables: {
      userId,
      queryParams: snakedQueryParams({ size: WORKSPACES_QUERY_SIZE }),
    },
    data: {
      workspaces: {
        pageToken,
        items: [
          ...items.slice(0, index),
          updatedWorkspaceItem,
          ...items.slice(index + 1),
        ],
        __typename,
        totalHits,
      },
    },
  });
};

const updateResourceBadgeCount = (userId, resourceId, incrementBy, client) => {
  const {
    resources: { pageToken, items, totalHits, __typename },
  } = client.readQuery({
    query: resourcesQuery,
    variables: {
      userId,
      queryParams: snakedQueryParams({ size: RESOURCES_QUERY_SIZE }),
    },
  });

  const index = items.findIndex(item => {
    const { document, discussion } = item;
    const resource = document || discussion;

    return resource.id === resourceId;
  });
  if (index < 0) return;

  const resourceItem = items[index];
  const updatedResourceItem = {
    ...resourceItem,
    badgeCount: Math.max(resourceItem.badgeCount + incrementBy, 0),
  };

  client.writeQuery({
    query: resourcesQuery,
    variables: {
      userId,
      queryParams: snakedQueryParams({ size: RESOURCES_QUERY_SIZE }),
    },
    data: {
      resources: {
        pageToken,
        items: [
          ...items.slice(0, index),
          updatedResourceItem,
          ...items.slice(index + 1),
        ],
        __typename,
        totalHits,
      },
    },
  });
};

const updateBadgeCount = (
  _root,
  { resourceType, resourceId, incrementBy },
  { client }
) => {
  const { userId } = getLocalUser();

  if (resourceType === 'workspace') {
    updateWorkspaceBadgeCount(userId, resourceId, incrementBy, client);
  } else {
    updateResourceBadgeCount(userId, resourceId, incrementBy, client);
  }
};

const updateResourceTags = (resource, client) => {
  const { resourceType, resourceQuery, variables } = resource;
  const data = client.readQuery({
    query: resourceQuery,
    variables,
  });

  if (!data) return null;

  const cachedResource = data[resourceType];
  const updatedData = {};
  updatedData[resourceType] = {
    ...cachedResource,
    tags: ['no_updates'],
  };

  client.writeQuery({
    query: resourceQuery,
    variables,
    data: updatedData,
  });

  return null;
};

const updateWorkspaceReactions = (resource, reaction, client) => {
  const { resourceQuery: workspaceQuery, variables } = resource;

  const data = client.readQuery({
    query: workspaceQuery,
    variables,
  });

  if (!data) return null;

  const { workspace, reactions } = data;
  client.writeQuery({
    query: workspaceQuery,
    variables,
    data: {
      workspace: {
        ...workspace,
        reactions: [...reactions, reaction],
      },
    },
  });

  return null;
};

/*
 * Different treatment for a workspace; instead of updating the tags
 * for the workspace, add the viewed reaction to the reactions array
 */
const markResourceAsRead = (_root, { resource, reaction }, { client }) => {
  const { resourceType } = resource;
  if (resourceType === 'workspace')
    return updateWorkspaceReactions(resource, reaction, client);

  return updateResourceTags(resource, client);

  // TODO (HN): Check if we need this. We can ignore the messages query
  // so that the new messages stay rendered as new messages.
  //
  // const data = client.readQuery({
  //   query: discussionMessagesQuery,
  //   variables: { discussionId, queryParams: {} },
  // });
  //
  // const { messages } = data;
  // const { items, pageToken } = messages;
  // const messagesWithTags = (items || []).map(i => i.message);
  // const updatedMessageItems = messagesWithTags.map(m => ({
  //   __typename: items[0].__typename,
  //   message: {
  //     ...m,
  //     tags: ['no_updates'],
  //   },
  // }));
  //
  // client.writeQuery({
  //   query: discussionMessagesQuery,
  //   variables: { discussionId, queryParams: {} },
  //   data: {
  //     messages: {
  //       ...data.messages,
  //       items: updatedMessageItems,
  //       pageToken,
  //     },
  //   },
  // });
};

const markWorkspaceResourceAsReadByTab = (
  type,
  { workspaceId, resourceType, resourceId },
  client
) => {
  const data = client.readQuery({
    query: workspaceResourcesQuery,
    variables: { workspaceId, queryParams: { type } },
  });
  if (!data || !data.workspaceResources) return;

  const { items, pageToken, totalHits, __typename } = data.workspaceResources;
  const index = items.findIndex(item => {
    const resource = item[resourceType];
    return resource && resource.id === resourceId;
  });

  if (index < 0) return;
  const resourceItem = items[index];
  const { lastUpdate } = resourceItem;
  const readResourceItem = {
    ...resourceItem,
    lastUpdate: {
      ...lastUpdate,
      readAt: Date.now(),
    },
  };

  client.writeQuery({
    query: workspaceResourcesQuery,
    variables: { workspaceId, queryParams: { type } },
    data: {
      workspaceResources: {
        items: [
          ...items.slice(0, index),
          readResourceItem,
          ...items.slice(index + 1),
        ],
        pageToken,
        totalHits,
        __typename,
      },
    },
  });
};

const markWorkspaceResourceAsRead = (_root, props, { client }) => {
  const { resourceType } = props;
  ['all', resourceType].forEach(type =>
    markWorkspaceResourceAsReadByTab(type, props, client)
  );

  return null;
};

export default {
  updateNotifications,
  updateBadgeCount,
  markResourceAsRead,
  markWorkspaceResourceAsRead,
};
