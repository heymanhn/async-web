import { useApolloClient } from 'react-apollo';

import createReactionMutation from 'graphql/mutations/createReaction';
import markDiscussionAsReadMutation from 'graphql/mutations/local/markDiscussionAsRead';
import notificationsQuery from 'graphql/queries/notifications';
import documentQuery from 'graphql/queries/document';
import { getLocalUser } from 'utils/auth';

const useViewedReaction = () => {
  const client = useApolloClient();

  function markAsRead({ isUnread, resourceType, resourceId } = {}) {
    const { userId } = getLocalUser();
    let refetchQueries = [
      {
        query: notificationsQuery,
        variables: { id: userId, queryParams: {} },
      },
    ];

    if (resourceType === 'document') {
      refetchQueries = [
        ...refetchQueries,
        {
          query: documentQuery,
          variables: { documentId: resourceId, queryParams: {} },
        },
      ];
    }
    client.mutate({
      mutation: createReactionMutation,
      variables: {
        input: {
          objectType: resourceType,
          objectId: resourceId,
          code: 'viewed',
        },
      },
      refetchQueries,
      // We're updating the cache directly instead of using refetchQueries since the conversations
      // list might be paginated, and we don't want to lose the user's intended scroll position
      // in the meeting space page
      update: () => {
        if (!isUnread) return;

        if (resourceType === 'discussion') {
          client.mutate({
            mutation: markDiscussionAsReadMutation,
            variables: {
              discussionId: resourceId,
            },
          });
        }
      },
    });
  }

  return { markAsRead };
};

export default useViewedReaction;
