import { useApolloClient } from 'react-apollo';

import createReactionMutation from 'graphql/mutations/createReaction';
import markConversationAsReadMutation from 'graphql/mutations/local/markConversationAsRead';
import meetingQuery from 'graphql/queries/meeting';
import meetingsQuery from 'graphql/queries/meetings';
import { MEETINGS_QUERY_SIZE } from 'graphql/constants';
import { snakedQueryParams } from 'utils/queryParams';

const useViewedReaction = () => {
  const client = useApolloClient();

  function updateMeetingCache(cache, meetingId, conversationId) {
    const data = cache.readQuery({
      query: meetingQuery,
      variables: { id: meetingId, queryParams: {} },
    });

    // It's possible for the meeting space data to not be in the cache, such as when the discussion
    // page is loaded directly.
    if (!data) return;

    const {
      meeting,
      conversations: { pageToken, items, __typename, totalHits },
    } = data;

    const index = items
      .map(i => i.conversation)
      .findIndex(c => c.id === conversationId);
    const conversationItem = items[index];
    const { conversation } = conversationItem;

    cache.writeQuery({
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
  }

  function markAsRead({ isUnread, objectType, objectId, parentId } = {}) {
    const meetingId = parentId || objectId;

    client.mutate({
      mutation: createReactionMutation,
      variables: {
        input: {
          objectType,
          objectId,
          code: 'viewed',
        },
      },
      // We're updating the cache directly instead of using refetchQueries since the conversations
      // list might be paginated, and we don't want to lose the user's intended scroll position
      // in the meeting space page
      update: () => {
        if (!isUnread) return;

        if (objectType === 'conversation') {
          client.mutate({
            mutation: markConversationAsReadMutation,
            variables: {
              conversationId: objectId,
              meetingId,
            },
          });
        }
      },
    });
  }

  return { markAsRead };
};

export default useViewedReaction;
