import { useApolloClient } from 'react-apollo';

import createReactionMutation from 'graphql/mutations/createReaction';
// import conversationQuery from 'graphql/queries/conversation';

const useViewedReaction = (meetingId) => {
  const client = useApolloClient();

  function markAsRead({ objectType, conversationId } = {}) {
    client.mutate({
      mutation: createReactionMutation,
      variables: {
        input: {
          objectType,
          objectId: objectType === 'conversation' ? conversationId : meetingId,
          parentId: meetingId,
          code: 'viewed',
        },
      },
      // HN: disabling this refetch for now until we write the new code for read/unread status
      // refetchQueries: [{
      //   query: conversationQuery,
      //   variables: { id: conversationId },
      // }],
    });
  }

  return { markAsRead };
};

export default useViewedReaction;
