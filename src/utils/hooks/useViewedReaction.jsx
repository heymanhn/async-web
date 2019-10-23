import { useApolloClient } from 'react-apollo';

import createReactionMutation from 'graphql/mutations/createReaction';
import markConversationAsReadMutation from 'graphql/mutations/local/markConversationAsRead';

const useViewedReaction = () => {
  const client = useApolloClient();

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
