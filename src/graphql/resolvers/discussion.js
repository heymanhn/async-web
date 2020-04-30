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

      // Need to pass null value if threadId doesn't exist, to satisfy Apollo
      // fragment shape
      threadId: threadId || null,
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

  const { id: newMessageId } = message;

  client.writeQuery({
    query: localStateQuery,
    data: {
      ...localState,
      pendingMessages: [...pendingMessages, newMessageId],
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
};
