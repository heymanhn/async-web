import localStateQuery from 'graphql/queries/localState';
import discussionQuery from 'graphql/queries/discussion';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';

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
  const { body: newBody, author: newAuthor, discussionId, threadId } = message;

  const data = client.readQuery({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: { order: 'desc' } },
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
  let safeItems = items || [];
  if (safeItems.find(i => i.message.id === id)) return null;

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
    tags,

    // Need to pass null value if threadId doesn't exist, to satisfy Apollo
    // fragment shape
    threadId: threadId || null,
  };

  const newMessageItem = {
    __typename: 'MessageItem',
    message: newMessage,
  };

  // If isUnread is false, this means the current user posted a new message, and
  // we should mark all existing messages as read.
  if (!isUnread) {
    safeItems = safeItems.map(item => {
      const { message: msg } = item;
      return { ...item, message: { ...msg, tags: ['no_updates'] } };
    });
  }

  client.writeQuery({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: { order: 'desc' } },
    data: {
      messages: {
        pageToken,
        items: [newMessageItem, ...safeItems],
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
        lastMessage: newMessage,
        messageCount: messageCount + 1,
        tags: ['new_messages'],
      },
    },
  });

  return null;
};

const addNewPendingMessage = (_root, { message }, { client }) => {
  const { data } = client.readQuery({ query: localStateQuery });
  if (!data) return null;

  const { pendingMessages, ...localState } = data;
  const { id: newMessageId } = message;

  client.writeQuery({
    query: localStateQuery,
    data: {
      ...localState,
      pendingMessages: [newMessageId, ...pendingMessages],
    },
  });

  return null;
};

const updateMessageInDiscussion = (
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
  if (index < 0) return null;

  const updatedItem = {
    ...items[index],
    message: {
      ...items[index].message,
      threadId: null,
    },
  };
  client.writeQuery({
    query: discussionMessagesQuery,
    variables: { discussionId, queryParams: {} },
    data: {
      messages: {
        items: [
          ...items.slice(0, index),
          updatedItem,
          ...items.slice(index + 1),
        ],
        messageCount,
        pageToken,
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

export default {
  addDraftToDiscussion,
  deleteDraftFromDiscussion,
  addNewMessageToDiscussionMessages,
  addNewPendingMessage,
  deleteMessageFromDiscussion,
  updateMessageInDiscussion,
};
