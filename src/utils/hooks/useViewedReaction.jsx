import { useApolloClient } from 'react-apollo';

import createReactionMutation from 'graphql/mutations/createReaction';
// import conversationQuery from 'graphql/queries/conversation';

const useViewedReaction = () => {
  const client = useApolloClient();

  function markAsRead({ objectType, objectId } = {}) {
    client.mutate({
      mutation: createReactionMutation,
      variables: {
        input: {
          objectType,
          objectId,
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
