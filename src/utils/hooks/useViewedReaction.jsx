import { useApolloClient } from '@apollo/react-hooks';

import createReactionMutation from 'graphql/mutations/createReaction';
import updateBadgeCountMutation from 'graphql/mutations/local/updateBadgeCount';
import markDiscussionAsReadMutation from 'graphql/mutations/local/markDiscussionAsRead';
import notificationsQuery from 'graphql/queries/notifications';
import discussionQuery from 'graphql/queries/discussion';
import documentQuery from 'graphql/queries/document';
import { getLocalUser } from 'utils/auth';
import markWorkspaceResourceAsRead from 'graphql/mutations/local/markWorkspaceResourceAsRead';

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
        let notificationResourceId = resourceId;
        let workspaceId;
        const incrementBy = -1;

        if (resourceType === 'discussion') {
          const data = client.readQuery({
            query: discussionQuery,
            variables: { discussionId: resourceId },
          });
          if (!data.discussion) return;

          // check if it's an inline discussion
          const { documentId, workspaces } = data.discussion;
          if (documentId) notificationResourceId = documentId;
          workspaceId = workspaces ? workspaces[0] : undefined;

          client.mutate({
            mutation: markDiscussionAsReadMutation,
            variables: {
              discussionId: resourceId,
            },
          });
        } else if (resourceType === 'document') {
          const data = client.readQuery({
            query: documentQuery,
            variables: { documentId: resourceId },
          });
          if (!data.document) return;

          const { workspaces } = data.document;
          workspaceId = workspaces ? workspaces[0] : undefined;
        }

        client.mutate({
          mutation: updateBadgeCountMutation,
          variables: {
            resourceType: workspaceId ? 'workspace' : resourceType,
            resourceId: workspaceId || notificationResourceId,
            incrementBy,
          },
        });

        if (workspaceId) {
          client.mutate({
            mutation: markWorkspaceResourceAsRead,
            variables: {
              workspaceId,
              resourceType,
              resourceId: notificationResourceId,
            },
          });
        }
      },
    });
  }

  return { markAsRead };
};

export default useViewedReaction;
