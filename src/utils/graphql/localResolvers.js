import meetingQuery from 'graphql/queries/meeting';
import meetingsQuery from 'graphql/queries/meetings';
import conversationQuery from 'graphql/queries/conversation';
import { MEETINGS_QUERY_SIZE } from 'graphql/constants';
import { snakedQueryParams } from 'utils/queryParams';

function findInItems(items, type, id) {
  const index = items
    .map(i => i[type])
    .findIndex(o => o.id === id);
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

const localResolvers = {
  Mutation: {
    addNewMessageToConversation,
    addNewMessageToMeetingSpace,
    markConversationAsRead,
    updateMeetingBadgeCount,
  },
};

export default localResolvers;
