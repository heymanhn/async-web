import { WORKSPACES_QUERY_SIZE, RESOURCES_QUERY_SIZE } from 'utils/constants';
import { getLocalUser } from 'utils/auth';
import { snakedQueryParams } from 'utils/queryParams';

import workspacesQuery from 'graphql/queries/workspaces';
import resourcesQuery from 'graphql/queries/resources';

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

  const index = (items || []).findIndex(i => i.workspace.id === resourceId);
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

  const index = (items || []).findIndex(item => {
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

  const { workspace } = data;
  const { reactions } = workspace;
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
 *
 * Also, intentionally not updating the tags for the new messages, so that
 * the new message UI on the discussion thread remains.
 */
const markResourceAsRead = (_root, { resource, reaction }, { client }) => {
  const { resourceType } = resource;
  if (resourceType === 'workspace')
    return updateWorkspaceReactions(resource, reaction, client);

  return updateResourceTags(resource, client);
};

export default {
  updateBadgeCount,
  markResourceAsRead,
};
