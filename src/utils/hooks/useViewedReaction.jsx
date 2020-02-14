import { useApolloClient } from 'react-apollo';

import createReactionMutation from 'graphql/mutations/createReaction';
import markDiscussionAsReadMutation from 'graphql/mutations/local/markDiscussionAsRead';
import notificationsQuery from 'graphql/queries/notifications';
import documentQuery from 'graphql/queries/document';
import { getLocalUser } from 'utils/auth';

const useViewedReaction = () => {
  const client = useApolloClient();

  function markAsRead({ isUnread, objectType, objectId } = {}) {
    const { userId } = getLocalUser();
    let refetchQueries = [
      {
        query: notificationsQuery,
        variables: { id: userId, queryParams: {} },
      },
    ];

    if (objectType === 'document') {
      refetchQueries = [
        ...refetchQueries,
        {
          query: documentQuery,
          variables: { documentId: objectId, queryParams: {} },
        },
      ];
    }
    client.mutate({
      mutation: createReactionMutation,
      variables: {
        input: {
          objectType,
          objectId,
          code: 'viewed',
        },
      },
      refetchQueries,
      // We're updating the cache directly instead of using refetchQueries since the conversations
      // list might be paginated, and we don't want to lose the user's intended scroll position
      // in the meeting space page
      update: () => {
        if (!isUnread) return;

        if (objectType === 'discussion') {
          client.mutate({
            mutation: markDiscussionAsReadMutation,
            variables: {
              discussionId: objectId,
            },
          });
        }
      },
    });
  }

  return { markAsRead };
};

export default useViewedReaction;
