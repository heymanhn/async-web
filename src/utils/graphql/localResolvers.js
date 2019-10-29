import localStateQuery from 'graphql/queries/localState';
import meetingQuery from 'graphql/queries/meeting';
import meetingsQuery from 'graphql/queries/meetings';
import conversationQuery from 'graphql/queries/conversation';
import { MEETINGS_QUERY_SIZE } from 'graphql/constants';
import { snakedQueryParams } from 'utils/queryParams';

function findInItems(items, type, id) {
  const index = items
    .map(i => i[type])
    .findIndex(o => o.id === id);

  if (index < 0) return { item: null, index };
  return { item: items[index], index };
}

function updateMeetingBadgeCount(_root, { meetingId, badgeCount }, { client }) {
  const data = client.readQuery({
    query: meetingsQuery,
    variables: { queryParams: snakedQueryParams({ size: MEETINGS_QUERY_SIZE }) },
  });
  if (!data) return null;

  const { meetings: { items, pageToken, __typename } } = data;
  const { item: meetingItem, index } = findInItems(items, 'meeting', meetingId);

  if (index < 0) return null; // In case the meeting hasn't showed up in the cache yet

  client.writeQuery({
    query: meetingsQuery,
    variables: { queryParams: snakedQueryParams({ size: MEETINGS_QUERY_SIZE }) },
    data: {
      meetings: {
        pageToken,
        items: [
          ...items.slice(0, index),
          {
            ...meetingItem,
            badgeCount,
          },
          ...items.slice(index + 1),
        ],
        __typename,
      },
    },
  });

  return null;
}

/*
 * Only mutates the cache if a query was run for the meeting
 * TODO: handle case of new discussion
 */
function addNewMessageToMeetingSpace(_root, { meetingId, message }, { client }) {
  const { conversationId } = message;
  const data = client.readQuery({
    query: meetingQuery,
    variables: { id: meetingId, queryParams: {} },
  });

  // It's possible for the meeting space data to not be in the cache, such as when the discussion
  // page is loaded directly.
  if (!data) return null;

  const { meeting, conversations: { pageToken, items, __typename, totalHits } } = data;
  const { item: conversationItem, index } = findInItems(items, 'conversation', conversationId);
  const { conversation } = conversationItem;

  // Not the most elegant solution but will suffice for now. Might not be a good long term solution
  // to have pusher return full objects because of the inconsistency between these objects and
  // apollo cache objects
  const { lastMessage } = conversation;
  const { body, author } = lastMessage;
  const { body: newBody, author: newAuthor } = message;
  const newLastMessage = {
    ...lastMessage,
    ...message,
    author: { ...author, ...newAuthor },
    body: { ...body, ...newBody },
  };

  client.writeQuery({
    query: meetingQuery,
    variables: { id: meetingId, queryParams: {} },
    data: {
      meeting,
      conversations: {
        totalHits,
        pageToken,
        items: [
          ...items.slice(0, index),
          {
            ...conversationItem,
            conversation: {
              ...conversation,
              tags: ['new_messages'],
              lastMessage: newLastMessage,
            },
          },
          ...items.slice(index + 1),
        ],
        __typename,
      },
    },
  });

  return null;
}

/*
 * Only for the conversation in the meeting space page
 */
function markConversationAsRead(_root, { conversationId, meetingId }, { client }) {
  const data = client.readQuery({
    query: meetingQuery,
    variables: { id: meetingId, queryParams: {} },
  });

  if (!data) return null;

  const { meeting, conversations: { pageToken, items, __typename, totalHits } } = data;
  const { item: conversationItem, index } = findInItems(items, 'conversation', conversationId);
  const { conversation } = conversationItem;

  client.writeQuery({
    query: meetingQuery,
    variables: { id: meetingId, queryParams: {} },
    data: {
      meeting,
      conversations: {
        totalHits,
        pageToken,
        items: [
          ...items.slice(0, index),
          {
            ...conversationItem,
            conversation: {
              ...conversation,
              tags: ['no_updates'],
            },
          },
          ...items.slice(index + 1),
        ],
        __typename,
      },
    },
  });

  return null;
}

function addDraftToConversation(_root, { conversationId, draft }, { client }) {
  const data = client.readQuery({
    query: conversationQuery,
    variables: { id: conversationId, queryParams: {} },
  });
  if (!data) return null;

  const { conversation, messages } = data;

  client.writeQuery({
    query: conversationQuery,
    variables: { id: conversationId, queryParams: {} },
    data: {
      conversation: {
        ...conversation,
        draft,
      },
      messages,
    },
  });

  return null;
}

// Cheeky. I know. But it works
function deleteDraftFromConversation(_root, { conversationId }, { client }) {
  return addDraftToConversation(_root, { conversationId, draft: null }, { client });
}

function addNewMessageToConversation(_root, { isUnread, message }, { client }) {
  const { body: newBody, author: newAuthor, conversationId } = message;

  const data = client.readQuery({
    query: conversationQuery,
    variables: { id: conversationId, queryParams: {} },
  });
  if (!data) return null;

  const {
    conversation,
    messages: { pageToken, items, __typename, messageCount },
  } = data;
  const { message: oldMessage } = items[0];
  const { author, body } = oldMessage;

  const newMessageItem = {
    __typename: items[0].__typename,
    message: {
      __typename: oldMessage.__typename,
      ...message,
      author: {
        __typename: author.__typename,
        ...newAuthor,
      },
      body: {
        __typename: body.__typename,
        ...newBody,
      },
      tags: isUnread ? ['new_message'] : null,
    },
  };

  client.writeQuery({
    query: conversationQuery,
    variables: { id: conversationId, queryParams: {} },
    data: {
      conversation,
      messages: {
        messageCount: messageCount + 1,
        pageToken,
        items: [...items, newMessageItem],
        __typename,
      },
    },
  });

  return null;
}

function addNewPendingMessage(_root, { message }, { client }) {
  const { pendingMessages } = client.readQuery({ query: localStateQuery });

  const { author: newAuthor, body: newBody } = message;
  const newMessage = {
    __typename: 'Message',
    ...message,
    author: {
      __typename: 'Author',
      ...newAuthor,
    },
    body: {
      __typename: 'Body',
      ...newBody,
    },
    tags: ['new_message'],
  };

  client.writeData({ data: { pendingMessages: [...pendingMessages, newMessage] } });

  return null;
}

function addPendingMessagesToConversation(_root, { conversationId }, { client }) {
  const { pendingMessages } = client.readQuery({ query: localStateQuery });

  const data = client.readQuery({
    query: conversationQuery,
    variables: { id: conversationId, queryParams: {} },
  });
  if (!data) return null;

  const {
    conversation,
    messages: { pageToken, items, __typename, messageCount },
  } = data;

  const pendingMessageItems = pendingMessages.map(m => ({
    __typename: items[0].__typename,
    message: m,
  }));

  client.writeQuery({
    query: conversationQuery,
    variables: { id: conversationId, queryParams: {} },
    data: {
      conversation,
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

function addNewMeetingToMeetings(_root, { meeting }, { client }) {
  const data = client.readQuery({
    query: meetingsQuery,
    variables: { queryParams: snakedQueryParams({ size: MEETINGS_QUERY_SIZE }) },
  });
  if (!data) return null;

  const {
    author: newAuthor,
    conversationCount,
    createdAt: newCreatedAt,
    id: newId,
    title: newTitle,
  } = meeting;
  const { meetings: { items, pageToken, __typename } } = data;
  const { meeting: oldMeeting } = items[0];
  const { author } = oldMeeting;

  const newMeetingItem = {
    __typename: items[0].__typename,
    meeting: {
      __typename: oldMeeting.__typename,
      author: {
        __typename: author.__typename,
        ...newAuthor,
      },
      body: null,
      createdAt: newCreatedAt,
      id: newId,
      title: newTitle,
    },
    badgeCount: 1, // The badge_count event will set it too, but might as well do it here first.
    conversationCount,
  };

  client.writeQuery({
    query: meetingsQuery,
    variables: { queryParams: snakedQueryParams({ size: MEETINGS_QUERY_SIZE }) },
    data: {
      meetings: {
        pageToken,
        items: [newMeetingItem, ...items],
        __typename,
      },
    },
  });

  return null;
}

const localResolvers = {
  Mutation: {
    addDraftToConversation,
    addNewPendingMessage,
    addPendingMessagesToConversation,
    addNewMessageToConversation,
    addNewMessageToMeetingSpace,
    addNewMeetingToMeetings,
    deleteDraftFromConversation,
    markConversationAsRead,
    updateMeetingBadgeCount,
  },
};

export default localResolvers;
