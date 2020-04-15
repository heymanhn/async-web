import { useMutation, useQuery } from '@apollo/react-hooks';
import Pluralize from 'pluralize';

import createReactionMutation from 'graphql/mutations/createReaction';
import localUpdateBadgeCountMtn from 'graphql/mutations/local/updateBadgeCount';
import localMarkResourceAsReadMtn from 'graphql/mutations/local/markResourceAsRead';
import localMarkNotificationAsReadMtn from 'graphql/mutations/local/markNotificationAsRead';
import discussionQuery from 'graphql/queries/discussion';
import documentQuery from 'graphql/queries/document';

import useDisambiguatedResource from 'utils/hooks/useDisambiguatedResource';

const useViewedReaction = () => {
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

  // const { userId } = getLocalUser();

  // Updates the sidebar ResourceRow badgeCounts
  // 1. If a discussion or document, decrement badge count for given resource in sidebar
  // 2. If workspace, or if discussion/document has a parent workspace, decrement badge count
  //    for the workspace in the sidebar
  // 3. If inline discussion, decrement badge count for the parent document
  const decrementResourceBadgeCounts = async () => {
    const { data } = await fetchResource();

    if (!data[resourceType])
      return Promise.reject(new Error('Unable to fetch resource'));

    const { documentId: parentDocumentId, workspaces } = data[resourceType];
    const parentWorkspaceId = workspaces ? workspaces[0] : undefined;

    // localUpdateBadgeCount({
    //   variables: {
    //     resourceType: workspaceId ? 'workspace' : resourceType,
    //     resourceId: workspaceId || notificationResourceId,
    //   },
    // });

    return Promise.resolve();
  };

  const markAsRead = async () => {
    const { data } = await createReaction();

    if (data.createReaction) {
      const { createReaction: reaction } = data;

      localMarkResourceAsRead({ variables: { reaction } });
      decrementResourceBadgeCounts();

      // This will also mark the workspace resource as read
      localMarkNotifAsRead();

      return Promise.resolve();
    }

    return Promise.reject(
      new Error('Unable to create viewed reaction for resource')
    );
  };

  return markAsRead;
};

export default useViewedReaction;
