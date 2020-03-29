import { useApolloClient } from '@apollo/react-hooks';

import createReactionMutation from 'graphql/mutations/createReaction';
import updateBadgeCountMutation from 'graphql/mutations/local/updateBadgeCount';
import markDiscussionAsReadMutation from 'graphql/mutations/local/markDiscussionAsRead';
import notificationsQuery from 'graphql/queries/notifications';
import discussionQuery from 'graphql/queries/discussion';
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
          variables: { documentId: resourceId },
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
        const incrementBy = -1;

        if (resourceType === 'discussion') {
          client.mutate({
            mutation: markDiscussionAsReadMutation,
            variables: {
              discussionId: resourceId,
            },
          });

          // check if it's an inline discussion
          const data = client.readQuery({
            query: discussionQuery,
            variables: { discussionId: resourceId },
          });
          if (!data.discussion) return;
          const { documentId } = data.discussion;

          client.mutate({
            mutation: updateBadgeCountMutation,
            variables: {
              resourceType,
              resourceId: documentId || resourceId,
              incrementBy,
            },
          });
        } else {
          client.mutate({
            mutation: updateBadgeCountMutation,
            variables: { resourceType, resourceId, incrementBy },
          });
        }
      },
    });
  }

  return { markAsRead };
};

export default useViewedReaction;
