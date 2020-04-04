import { useApolloClient } from '@apollo/react-hooks';
import Pluralize from 'pluralize';

import createReactionMutation from 'graphql/mutations/createReaction';
import localUpdateBadgeCountMutation from 'graphql/mutations/local/updateBadgeCount';
import localMarkDiscussionAsReadMutation from 'graphql/mutations/local/markDiscussionAsRead';
import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';
import discussionQuery from 'graphql/queries/discussion';
import documentQuery from 'graphql/queries/document';
import { getLocalUser } from 'utils/auth';
import localMarkWorkspaceResourceAsRead from 'graphql/mutations/local/markWorkspaceResourceAsRead';

const useViewedReaction = () => {
  const client = useApolloClient();

  const getParentResourceId = (resourceType, resourceId) => {
    let discussion;
    let document;
    if (resourceType === 'discussion') {
      const data = client.readQuery({
        query: discussionQuery,
        variables: { discussionId: resourceId },
      });
      discussion = data && data.discussion;
    } else if (resourceType === 'document') {
      const data = client.readQuery({
        query: documentQuery,
        variables: { documentId: resourceId },
      });
      document = data && data.document;
    }

    const resource = discussion || document;
    if (!resource) return {};
    const { workspaces } = resource;
    const documentId =
      (document && document.id) || (discussion && discussion.documentId);
    const workspaceId = workspaces ? workspaces[0] : undefined;

    return { documentId, workspaceId };
  };

  function markAsRead({ isUnread, resourceType, resourceId } = {}) {
    const { userId } = getLocalUser();
    const { documentId, workspaceId } = getParentResourceId(
      resourceType,
      resourceId
    );

    let refetchQueries = [
      {
        query: resourceNotificationsQuery,
        variables: { resourceType: 'users', resourceId: userId },
      },
    ];
    [
      { resourceType: 'workspace', resourceId: workspaceId },
      { resourceType: 'document', resourceId: documentId },
    ].forEach(item => {
      if (item.resourceId) {
        refetchQueries = [
          ...refetchQueries,
          {
            query: resourceNotificationsQuery,
            variables: {
              resourceType: Pluralize(item.resourceType),
              resourceId: item.resourceId,
            },
          },
        ];
      }
    });

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

        if (resourceType === 'discussion') {
          // TODO: think of a better to handle multiple local mututations.
          if (documentId) notificationResourceId = documentId;

          client.mutate({
            mutation: localMarkDiscussionAsReadMutation,
            variables: {
              discussionId: resourceId,
            },
          });
        }

        // Update the sidebar ResourceRow badgeCount
        client.mutate({
          mutation: localUpdateBadgeCountMutation,
          variables: {
            resourceType: workspaceId ? 'workspace' : resourceType,
            resourceId: workspaceId || notificationResourceId,
            incrementBy: -1,
          },
        });

        // If this resource is part of a workspace, mark the state as Read
        if (workspaceId) {
          client.mutate({
            mutation: localMarkWorkspaceResourceAsRead,
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
