import { useApolloClient } from 'react-apollo';

import createReactionMutation from 'graphql/mutations/createReaction';
import markDiscussionAsReadMutation from 'graphql/mutations/local/markDiscussionAsRead';
import documentNotificationsQuery from 'graphql/queries/documentNotifications';
import discussionQuery from 'graphql/queries/discussion';

const useViewedReaction = () => {
  const client = useApolloClient();

  function markAsRead({ isUnread, objectType, objectId, parentId } = {}) {
    const documentId = parentId || objectId;

    client.mutate({
      mutation: createReactionMutation,
      variables: {
        input: {
          objectType,
          objectId,
          code: 'viewed',
        },
      },
      refetchQueries: [
        {
          query: documentNotificationsQuery,
          variables: { id: documentId, queryParams: {} },
        },
        {
          query: discussionQuery,
          variables: { id: objectId, queryParams: {} },
        },
      ],
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
