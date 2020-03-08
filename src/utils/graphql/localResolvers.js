import localStateQuery from 'graphql/queries/localState';
import discussionQuery from 'graphql/queries/discussion';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import resourceMembersQuery from 'graphql/queries/resourceMembers';
import notificationsQuery from 'graphql/queries/notifications';
import inboxQuery from 'graphql/queries/inbox';

import { getLocalUser } from 'utils/auth';

const addDraftToDiscussion = (_root, { discussionId, draft }, { client }) => {
  const data = client.readQuery({
    query: discussionQuery,
    variables: { discussionId },
  });
  if (!data) return null;

  const { discussion } = data;

  client.writeQuery({
    query: discussionQuery,
    variables: { discussionId },
    data: {
      discussion: {
        ...discussion,
        draft,
      },
    },
  });

  return null;
};

// Cheeky. I know. But it works
const deleteDraftFromDiscussion = (_root, { discussionId }, { client }) =>
  addDraftToDiscussion(_root, { discussionId, draft: null }, { client });

const addNewMessageToDiscussionMessages = (
  _root,
  { isUnread, message },
  { client }
) => {
  const { body: newBody, author: newAuthor, discussionId } = message;

  const data = client.readQuery({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: {} },
  });

  const data2 = client.readQuery({
    query: discussionQuery,
    variables: { discussionId },
  });

  if (!data || !data2) return null;

  const {
    messages: { pageToken, items, __typename },
  } = data;
  const tags = isUnread ? ['new_message'] : ['no_updates'];

  // Avoid inserting duplicate entries in the cache. This could happen if the
  // queries have already been fetched before the cache update.
  const { id } = message;
  const safeItems = items || [];
  if (safeItems.find(i => i.message.id === id)) return null;

  const newMessageItem = {
    __typename: 'MessageItem',
    message: {
      __typename: 'Message',
      ...message,
      author: {
        __typename: 'User',
        ...newAuthor,
      },
      body: {
        __typename: 'Body',
        ...newBody,
      },
      tags,
    },
  };

  client.writeQuery({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: {} },
    data: {
      messages: {
        pageToken,
        items: [...(items || []), newMessageItem],
        __typename,
      },
    },
  });

  const { discussion } = data2;
  const { messageCount } = discussion;

  // Only update if the discussion query hasn't already been refetched
  if (messageCount > safeItems.length) return null;

  client.writeQuery({
    query: discussionQuery,
    variables: { discussionId },
    data: {
      discussion: {
        ...discussion,
        messageCount: messageCount + 1,
        tags,
      },
    },
  });

  return null;
};

const addNewPendingMessage = (_root, { message }, { client }) => {
  const { pendingMessages, ...localState } = client.readQuery({
    query: localStateQuery,
  });

  const { author: newAuthor, body: newBody } = message;
  const newMessage = {
    __typename: 'Message',
    ...message,
    author: {
      __typename: 'User',
      ...newAuthor,
    },
    body: {
      __typename: 'Body',
      ...newBody,
    },
    tags: ['new_message'],
  };

  client.writeQuery({
    query: localStateQuery,
    data: {
      ...localState,
      pendingMessages: [...pendingMessages, newMessage],
    },
  });

  return null;
};

const addPendingMessagesToDiscussion = (
  _root,
  { discussionId },
  { client }
) => {
  const { pendingMessages } = client.readQuery({ query: localStateQuery });

  const data = client.readQuery({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: {} },
  });
  if (!data) return null;

  const {
    messages: { pageToken, items, __typename, messageCount },
  } = data;

  const pendingMessageItems = pendingMessages.map(m => ({
    __typename: items[0].__typename,
    message: m,
  }));

  client.writeQuery({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: {} },
    data: {
      messages: {
        messageCount: messageCount + pendingMessageItems.length,
        pageToken,
        items: [...items, ...pendingMessageItems],
        __typename,
      },
    },
  });

  client.writeData({ data: { pendingMessages: [] } });

  return null;
};

const addMember = (
  _root,
  { resourceType, id, user, accessType },
  { client }
) => {
  const data = client.readQuery({
    query: resourceMembersQuery,
    variables: { resourceType, id },
  });
  if (!data) return null;

  const { resourceMembers } = data;
  const { members, __typename } = resourceMembers;

  const newMember = {
    ...members[0],
    user,
    accessType,
  };

  client.writeQuery({
    query: resourceMembersQuery,
    variables: { resourceType, id },
    data: {
      resourceMembers: {
        members: [...members, newMember],
        __typename,
      },
    },
  });

  return null;
};

const removeMember = (_root, { resourceType, id, userId }, { client }) => {
  const data = client.readQuery({
    query: resourceMembersQuery,
    variables: { resourceType, id },
  });
  if (!data) return null;

  const { resourceMembers } = data;
  const { members, __typename } = resourceMembers;

  const index = members.findIndex(p => p.user.id === userId);
  if (index < 0) return null;

  client.writeQuery({
    query: resourceMembersQuery,
    variables: { resourceType, id },
    data: {
      resourceMembers: {
        members: [...members.slice(0, index), ...members.slice(index + 1)],
        __typename,
      },
    },
  });

  return null;
};

const updateBadgeCount = (_root, { userId, notification }, { client }) => {
  const data = client.readQuery({
    query: notificationsQuery,
    variables: { id: userId },
  });

  if (!data) return null;

  const { userNotifications } = data;
  const { notifications, __typename } = userNotifications;
  const safeNotifications = notifications || [notification];
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
    query: notificationsQuery,
    variables: { id: userId },
    data: {
      userNotifications: {
        notifications: notificationsData,
        __typename,
      },
    },
  });

  return null;
};

const deleteMessageFromDiscussion = (
  _root,
  { discussionId, messageId },
  { client }
) => {
  const {
    messages: { pageToken, items, __typename, messageCount },
  } = client.readQuery({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: {} },
  });

  const index = items.findIndex(i => i.message.id === messageId);
  client.writeQuery({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: {} },
    data: {
      messages: {
        messageCount: messageCount - 1,
        pageToken,
        items: [...items.slice(0, index), ...items.slice(index + 1)],
        __typename,
      },
    },
  });

  return null;
};

const deleteDiscussionFromDocument = (
  _root,
  { documentId, discussionId },
  { client }
) => {
  const {
    documentDiscussions: { items, pageToken, __typename },
  } = client.readQuery({
    query: documentDiscussionsQuery,
    variables: { id: documentId, queryParams: { order: 'desc' } },
  });

  const index = items.findIndex(i => i.discussion.id === discussionId);
  client.writeQuery({
    query: documentDiscussionsQuery,
    variables: { id: documentId, queryParams: { order: 'desc' } },
    data: {
      documentDiscussions: {
        items: [...items.slice(0, index), ...items.slice(index + 1)],
        pageToken,
        __typename,
      },
    },
  });

  return null;
};

const markDiscussionAsRead = (_root, { discussionId }, { client }) => {
  const data = client.readQuery({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: {} },
  });

  const data2 = client.readQuery({
    query: discussionQuery,
    variables: { discussionId },
  });

  if (!data || !data2) return null;
  const { messages } = data;
  const { items, pageToken } = messages;
  const messagesWithTags = (items || []).map(i => i.message);
  const updatedMessageItems = messagesWithTags.map(m => ({
    __typename: items[0].__typename,
    message: {
      ...m,
      tags: ['no_updates'],
    },
  }));

  client.writeQuery({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: {} },
    data: {
      messages: {
        ...data.messages,
        items: updatedMessageItems,
        pageToken,
      },
    },
  });

  const { discussion } = data2;

  client.writeQuery({
    query: discussionQuery,
    variables: { discussionId },
    data: {
      discussion: {
        ...discussion,
        tags: ['no_updates'],
      },
    },
  });

  return null;
};

/*
 * Remove the entry from two of the tabs. The "All" tab, and either the
 * "Documents" or "Discussions" tab.
 */
const deleteFromInboxQuery = (type, { resourceType, resourceId }, client) => {
  const { userId } = getLocalUser();
  const {
    inbox: { items, pageToken, __typename },
  } = client.readQuery({
    query: inboxQuery,
    variables: { userId, queryParams: { type } },
  });

  const index = items.findIndex(item => {
    const resource = item[resourceType];
    return resource && resource.id === resourceId;
  });

  client.writeQuery({
    query: inboxQuery,
    variables: { userId, queryParams: { type } },
    data: {
      inbox: {
        items: [...items.slice(0, index), ...items.slice(index + 1)],
        pageToken,
        __typename,
      },
    },
  });
};

const deleteResourceFromInbox = (_root, props, { client }) => {
  const { resourceType } = props;
  ['all', resourceType].forEach(type =>
    deleteFromInboxQuery(type, props, client)
  );

  return null;
};

const localResolvers = {
  Mutation: {
    addDraftToDiscussion,
    deleteDraftFromDiscussion,
    addNewMessageToDiscussionMessages,
    addNewPendingMessage,
    addPendingMessagesToDiscussion,
    addMember,
    removeMember,
    updateBadgeCount,
    deleteMessageFromDiscussion,
    deleteDiscussionFromDocument,
    markDiscussionAsRead,
    deleteResourceFromInbox,
  },
};

export default localResolvers;
