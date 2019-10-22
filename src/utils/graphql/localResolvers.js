import meetingQuery from 'graphql/queries/meeting';
import meetingsQuery from 'graphql/queries/meetings';
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
function addNewMessageToMeetingSpace(_root, { meetingId, conversationId, message }, { client }) {
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
              lastMessage: message,
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

  // It's possible for the meeting space data to not be in the cache, such as when the discussion
  // page is loaded directly.
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

// TODO

// function addNewMessageToConversation(_root, { conversationId, message }, { cache }) {
//   const data = cache.readQuery({
//     query: meetingQuery,
//     variables: { queryParams: snakedQueryParams({ size: MEETINGS_QUERY_SIZE }) },
//   });

//   if (!data) return;


//   const data2 = client.readQuery({
//     query: meetingQuery,
//     variables: { id: meeting_id, queryParams: {} },
//   });

//   if (!data2) return;
// }

const localResolvers = {
  Mutation: {
    // addNewMessageToConversation,
    addNewMessageToMeetingSpace,
    markConversationAsRead,
    updateMeetingBadgeCount,
  },
};

export default localResolvers;
