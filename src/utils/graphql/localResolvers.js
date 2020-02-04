import localStateQuery from 'graphql/queries/localState';
import discussionQuery from 'graphql/queries/discussion';
import documentParticipantsQuery from 'graphql/queries/documentParticipants';
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

function addDocumentParticipant(_root, { id, user, accessType }, { client }) {
  const data = client.readQuery({
    query: documentParticipantsQuery,
    variables: { id },
  });
  if (!data) return null;

  const { documentParticipants } = data;
  const { participants, __typename } = documentParticipants;

  const newParticipant = {
    ...participants[0],
    user,
    accessType,
  };

  client.writeQuery({
    query: documentParticipantsQuery,
    variables: { id },
    data: {
      documentParticipants: {
        participants: [...participants, newParticipant],
        __typename,
      },
    },
  });

  return null;
}

function removeDocumentParticipant(_root, { id, participantId }, { client }) {
  const data = client.readQuery({
    query: documentParticipantsQuery,
    variables: { id },
  });
  if (!data) return null;

  const { documentParticipants } = data;
  const { participants, __typename } = documentParticipants;

  const index = participants.findIndex(p => p.user.id === participantId);
  if (index < 0) return null;

  client.writeQuery({
    query: documentParticipantsQuery,
    variables: { id },
    data: {
      documentParticipants: {
        participants: [
          ...participants.slice(0, index),
          ...participants.slice(index + 1),
        ],
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
    addDocumentParticipant,
    removeDocumentParticipant,
    updateBadgeCount,
    deleteMessageFromDiscussion,
  },
};

export default localResolvers;
