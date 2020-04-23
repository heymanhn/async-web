import { useMutation, useQuery } from '@apollo/react-hooks';

import createReactionMutation from 'graphql/mutations/createReaction';
import localUpdateBadgeCountMtn from 'graphql/mutations/local/updateBadgeCount';
import localMarkResourceAsReadMtn from 'graphql/mutations/local/markResourceAsRead';
import localMarkNotificationAsReadMtn from 'graphql/mutations/local/markNotificationAsRead';
import useDisambiguatedResource from 'hooks/resources/useDisambiguatedResource';

const useMarkResourceAsRead = () => {
  const resource = useDisambiguatedResource();
  const { resourceType, resourceId, resourceQuery, variables } = resource;

  // Clever way to create a query function that returns a Promise ;-)
  // https://github.com/apollographql/react-apollo/issues/3499#issuecomment-586039082
  const { refetch: fetchResource } = useQuery(resourceQuery, {
    variables,
    skip: true,
  });

  const [createReaction] = useMutation(createReactionMutation, {
    variables: {
      input: {
        objectType: resourceType,
        objectId: resourceId,
        code: 'viewed',
      },
    },
  });
  const [localMarkResourceAsRead] = useMutation(localMarkResourceAsReadMtn, {
    variables: { resource },
  });
  const [localMarkNotifAsRead] = useMutation(localMarkNotificationAsReadMtn, {
    variables: { objectId: resourceId },
  });
  const [localUpdateBadgeCount] = useMutation(localUpdateBadgeCountMtn, {
    variables: { incrementBy: -1 },
  });

  const getParentIds = async () => {
    const { data } = await fetchResource();

    if (!data[resourceType])
      return Promise.reject(new Error('Unable to fetch resource'));

    const { documentId: parentDocumentId, workspaces } = data[resourceType];
    const parentWorkspaceId = workspaces ? workspaces[0] : undefined;

    return Promise.resolve({ parentDocumentId, parentWorkspaceId });
  };

  // Updates the sidebar ResourceRow badgeCounts for:
  // 1. the current resource
  // 2. the parent workspace, if available
  // 3. the parent document, if this is a document discussion
  const decrementResourceBadgeCounts = async () => {
    const { parentDocumentId, parentWorkspaceId } = await getParentIds();

    localUpdateBadgeCount({ variables: { resourceType, resourceId } });

    if (parentDocumentId) {
      localUpdateBadgeCount({
        variables: { resourceType: 'document', resourceId: parentDocumentId },
      });
    }

    if (parentWorkspaceId) {
      localUpdateBadgeCount({
        variables: { resourceType: 'workspace', resourceId: parentWorkspaceId },
      });
    }

    return Promise.resolve();
  };

  const markAsRead = async () => {
    const { data } = await createReaction();

    if (data.createReaction) {
      const { createReaction: reaction } = data;

      localMarkResourceAsRead({ variables: { reaction } });
      decrementResourceBadgeCounts();

      // Also marks the workspace resource as read, if it exists
      localMarkNotifAsRead();

      return Promise.resolve();
    }

    return Promise.reject(
      new Error('Unable to create viewed reaction for resource')
    );
  };

  return markAsRead;
};

export default useMarkResourceAsRead;
