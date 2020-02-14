import localStateQuery from 'graphql/queries/localState';
import discussionQuery from 'graphql/queries/discussion';
import objectMembersQuery from 'graphql/queries/objectMembers';
import notificationsQuery from 'graphql/queries/notifications';

function addDraftToDiscussion(_root, { discussionId, draft }, { client }) {
  const data = client.readQuery({
    query: discussionQuery,
    variables: { discussionId, queryParams: {} },
  });
  if (!data) return null;

  const { discussion, messages } = data;

  client.writeQuery({
    query: discussionQuery,
    variables: { discussionId, queryParams: {} },
    data: {
      discussion: {
        ...discussion,
        draft,
      },
      messages,
    },
  });

  return null;
}

// Cheeky. I know. But it works
function deleteDraftFromDiscussion(_root, { discussionId }, { client }) {
  return addDraftToDiscussion(_root, { discussionId, draft: null }, { client });
}

function addNewMessageToDiscussion(_root, { isUnread, message }, { client }) {
  const { body: newBody, author: newAuthor, discussionId } = message;

  const data = client.readQuery({
    query: discussionQuery,
    variables: { discussionId, queryParams: {} },
  });
  if (!data) return null;

  const {
    discussion,
    messages: { pageToken, items, __typename, messageCount },
  } = data;

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
      tags: isUnread ? ['new_message'] : null,
    },
  };

  client.writeQuery({
    query: discussionQuery,
    variables: { discussionId, queryParams: {} },
    data: {
      discussion: {
        ...discussion,
        tags: isUnread ? ['new_messages'] : null,
      },
      messages: {
        messageCount: messageCount + 1,
        pageToken,
        items: [...(items || []), newMessageItem],
        __typename,
      },
    },
  });

  return null;
}

function addNewPendingMessage(_root, { message }, { client }) {
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
}

function addPendingMessagesToDiscussion(_root, { discussionId }, { client }) {
  const { pendingMessages } = client.readQuery({ query: localStateQuery });

  const data = client.readQuery({
    query: discussionQuery,
    variables: { discussionId, queryParams: {} },
  });
  if (!data) return null;

  const {
    discussion,
    messages: { pageToken, items, __typename, messageCount },
  } = data;

  const pendingMessageItems = pendingMessages.map(m => ({
    __typename: items[0].__typename,
    message: m,
  }));

  client.writeQuery({
    query: discussionQuery,
    variables: { discussionId, queryParams: {} },
    data: {
      discussion,
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
}

function addMember(_root, { objectType, id, user, accessType }, { client }) {
  const data = client.readQuery({
    query: objectMembersQuery,
    variables: { objectType, id },
  });
  if (!data) return null;

  const { objectMembers } = data;
  const { members, __typename } = objectMembers;

  const newMember = {
    ...members[0],
    user,
    accessType,
  };

  client.writeQuery({
    query: objectMembersQuery,
    variables: { objectType, id },
    data: {
      objectMembers: {
        members: [...members, newMember],
        __typename,
      },
    },
  });

  return null;
}

function removeMember(_root, { objectType, id, userId }, { client }) {
  const data = client.readQuery({
    query: objectMembersQuery,
    variables: { objectType, id },
  });
  if (!data) return null;

  const { objectMembers } = data;
  const { members, __typename } = objectMembers;

  const index = members.findIndex(p => p.user.id === userId);
  if (index < 0) return null;

  client.writeQuery({
    query: objectMembersQuery,
    variables: { objectType, id },
    data: {
      objectMembers: {
        members: [...members.slice(0, index), ...members.slice(index + 1)],
        __typename,
      },
    },
  });

  return null;
}

function updateBadgeCount(_root, { userId, notification }, { client }) {
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
}

function deleteMessageFromDiscussion(
  _root,
  { discussionId, messageId },
  { client }
) {
  const {
    discussion,
    messages: { pageToken, items, __typename, messageCount },
  } = client.readQuery({
    query: discussionQuery,
    variables: { discussionId, queryParams: {} },
  });

  const index = items.findIndex(i => i.message.id === messageId);
  client.writeQuery({
    query: discussionQuery,
    variables: { discussionId, queryParams: {} },
    data: {
      discussion,
      messages: {
        messageCount: messageCount - 1,
        pageToken,
        items: [...items.slice(0, index), ...items.slice(index + 1)],
        __typename,
      },
    },
  });

  return null;
}

function markDiscussionAsRead(_root, { discussionId }, { client }) {
  const data = client.readQuery({
    query: discussionQuery,
    variables: { discussionId, queryParams: {} },
  });

  if (!data.discussion || !data.messages) return null;
  const { messages, discussion } = data;
  const { items, pageToken } = messages;
  const messagesWithTags = (items || []).map(i => i.message);
  const updatedMessageItems = messagesWithTags.map(m => ({
    __typename: items[0].__typename,
    message: {
      ...m,
      tags: null,
    },
  }));

  client.writeQuery({
    query: discussionQuery,
    variables: { discussionId, queryParams: {} },
    data: {
      discussion: {
        ...discussion,
        tags: ['no_updates'],
      },
      messages: {
        ...data.messages,
        items: updatedMessageItems,
        pageToken,
      },
    },
  });

  return null;
}

const localResolvers = {
  Mutation: {
    addDraftToDiscussion,
    deleteDraftFromDiscussion,
    addNewMessageToDiscussion,
    addNewPendingMessage,
    addPendingMessagesToDiscussion,
    addMember,
    removeMember,
    updateBadgeCount,
    deleteMessageFromDiscussion,
    markDiscussionAsRead,
  },
};

export default localResolvers;
