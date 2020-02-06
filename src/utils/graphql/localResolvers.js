import localStateQuery from 'graphql/queries/localState';
import discussionQuery from 'graphql/queries/discussion';
import documentMembersQuery from 'graphql/queries/documentMembers';
import discussionMembersQuery from 'graphql/queries/discussionMembers';
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
      discussion,
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

function addPendingRepliesToDiscussion(_root, { discussionId }, { client }) {
  const { pendingReplies } = client.readQuery({ query: localStateQuery });

  const data = client.readQuery({
    query: discussionQuery,
    variables: { discussionId, queryParams: {} },
  });
  if (!data) return null;

  const {
    discussion,
    messages: { pageToken, items, __typename, messageCount },
  } = data;

  const pendingMessageItems = pendingReplies.map(m => ({
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

  client.writeData({ data: { pendingReplies: [] } });

  return null;
}

function addDocumentMember(_root, { id, user, accessType }, { client }) {
  const data = client.readQuery({
    query: documentMembersQuery,
    variables: { id },
  });
  if (!data) return null;

  const { documentMembers } = data;
  const { members, __typename } = documentMembers;

  const newMember = {
    ...members[0],
    user,
    accessType,
  };

  client.writeQuery({
    query: documentMembersQuery,
    variables: { id },
    data: {
      documentMembers: {
        members: [...members, newMember],
        __typename,
      },
    },
  });

  return null;
}

function removeDocumentMember(_root, { id, userId }, { client }) {
  const data = client.readQuery({
    query: documentMembersQuery,
    variables: { id },
  });
  if (!data) return null;

  const { documentMembers } = data;
  const { members, __typename } = documentMembers;

  const index = members.findIndex(p => p.user.id === userId);
  if (index < 0) return null;

  client.writeQuery({
    query: documentMembersQuery,
    variables: { id },
    data: {
      documentMembers: {
        members: [...members.slice(0, index), ...members.slice(index + 1)],
        __typename,
      },
    },
  });

  return null;
}

function addDiscussionMember(_root, { id, user, accessType }, { client }) {
  const data = client.readQuery({
    query: discussionMembersQuery,
    variables: { id },
  });
  if (!data) return null;

  const { discussionMembers } = data;
  const { members, __typename } = discussionMembers;

  const newMember = {
    ...members[0],
    user,
    accessType,
  };

  client.writeQuery({
    query: discussionMembersQuery,
    variables: { id },
    data: {
      discussionMembers: {
        members: [...members, newMember],
        __typename,
      },
    },
  });

  return null;
}

function removeDiscussionMember(_root, { id, userId }, { client }) {
  const data = client.readQuery({
    query: discussionMembersQuery,
    variables: { id },
  });
  if (!data) return null;

  const { discussionMembers } = data;
  const { members, __typename } = discussionMembers;

  const index = members.findIndex(p => p.user.id === userId);
  if (index < 0) return null;

  client.writeQuery({
    query: discussionMembersQuery,
    variables: { id },
    data: {
      discussionMembers: {
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

const localResolvers = {
  Mutation: {
    addDraftToDiscussion,
    deleteDraftFromDiscussion,
    addNewMessageToDiscussion,
    addPendingRepliesToDiscussion,
    addDocumentMember,
    removeDocumentMember,
    addDiscussionMember,
    removeDiscussionMember,
    updateBadgeCount,
    deleteMessageFromDiscussion,
  },
};

export default localResolvers;
