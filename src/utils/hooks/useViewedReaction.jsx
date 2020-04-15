import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import Pluralize from 'pluralize';

import createReactionMutation from 'graphql/mutations/createReaction';
import localUpdateBadgeCountMtn from 'graphql/mutations/local/updateBadgeCount';
import localMarkDiscussionAsReadMtn from 'graphql/mutations/local/markDiscussionAsRead';
import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';
import discussionQuery from 'graphql/queries/discussion';
import documentQuery from 'graphql/queries/document';
import localMarkWorkspaceResourceAsRead from 'graphql/mutations/local/markWorkspaceResourceAsRead';
import { getLocalUser } from 'utils/auth';
import useDisambiguatedResource from 'utils/hooks/useDisambiguatedResource';

const useViewedReaction = () => {
  const client = useApolloClient(); // TODO (HN): Check if this is still needed
  const {
    resourceType,
    resourceId,
    resourceQuery,
    variables,
  } = useDisambiguatedResource();

  const [createReaction] = useMutation(createReactionMutation, {
    variables: {
      input: {
        objectType: resourceType,
        objectId: resourceId,
        code: 'viewed',
      },
    },
  });
  const [localMarkDiscussionAsRead] = useMutation(
    localMarkDiscussionAsReadMtn,
    {
      variables,
    }
  );
  const [localUpdateBadgeCount] = useMutation(localUpdateBadgeCountMtn, {
    variables: { incrementBy: -1 },
  });

  // TODO (HN): use a useLazyQuery to fetch the resource later?

  // const getParentResourceId = (resourceType, resourceId) => {
  //   let discussion;
  //   let document;
  //   if (resourceType === 'discussion') {
  //     const data = client.readQuery({
  //       query: discussionQuery,
  //       variables: { discussionId: resourceId },
  //     });
  //     discussion = data && data.discussion;
  //   } else if (resourceType === 'document') {
  //     const data = client.readQuery({
  //       query: documentQuery,
  //       variables: { documentId: resourceId },
  //     });
  //     document = data && data.document;
  //   }

  //   const resource = discussion || document;
  //   if (!resource) return {};
  //   const { workspaces } = resource;
  //   const documentId =
  //     (document && document.id) || (discussion && discussion.documentId);
  //   const workspaceId = workspaces ? workspaces[0] : undefined;

  //   return { documentId, workspaceId };
  // };

  // const { userId } = getLocalUser();
  // const { documentId, workspaceId } = getParentResourceId(
  //   resourceType,
  //   resourceId
  // );

  // let refetchQueries = [
  //     {
  //       query: resourceNotificationsQuery,
  //       variables: {
  //         resourceType: 'users',
  //         resourceId: userId,
  //         queryParams: {},
  //       },
  //     },
  //   ];
  //   [
  //     { resourceType: 'workspace', resourceId: workspaceId },
  //     { resourceType: 'document', resourceId: documentId },
  //   ].forEach(item => {
  //     if (item.resourceId) {
  //       refetchQueries = [
  //         ...refetchQueries,
  //         {
  //           query: resourceNotificationsQuery,
  //           variables: {
  //             resourceType: Pluralize(item.resourceType),
  //             resourceId: item.resourceId,
  //             queryParams: {},
  //           },
  //         },
  //       ];
  //     }
  //   });

  // Update local state for the resource (update tags to ["no_updates"] for discussion/document)
  // -> Q: Do I need to update local state for a workspace too? Probably, if I want to avoid excessive sending of viewed reactions.
  // -> If I do, I can capture the created reaction in POST /reactions response, then add it to the local cache.
  const markLocalResourceAsRead = reaction => {
    switch (resourceType) {
      case 'discussion':
        return localMarkDiscussionAsRead();
      case 'workspace':
        return console.log('TODO: Mark local workspace as read...');
      default:
        return null;
    }
  };

  // HN: See if this is needed
  const markWorkspaceResourceAsRead = () => {
    //     let notificationResourceId = resourceId;
    //     // TODO: think of a better to handle multiple local mututations.
    //     if (documentId) notificationResourceId = documentId;
    //
    //     // If this resource is part of a workspace, mark the state as Read
    //     if (workspaceId) {
    //       client.mutate({
    //         mutation: localMarkWorkspaceResourceAsRead,
    //         variables: {
    //           workspaceId,
    //           resourceType,
    //           resourceId: notificationResourceId,
    //         },
    //       });
    //     }

    return console.log('TODO: Mark workspace resource as read...');
  };

  // Updates the sidebar ResourceRow badgeCounts
  // 1. If a discussion or document, decrement badge count for given resource in sidebar
  // 2. If workspace, or if discussion/document has a parent workspace, decrement badge count
  //    for the workspace in the sidebar
  const decrementResourceBadgeCounts = () => {
    // localUpdateBadgeCount({
    //   variables: {
    //     resourceType: workspaceId ? 'workspace' : resourceType,
    //     resourceId: workspaceId || notificationResourceId,
    //   },
    // });
    return console.log('TODO: Decrement resource badge counts...');
  };

  const markLocalNotificationsAsRead = () => {
    return console.log('TODO: Mark local notifications as read...');
  };

  const markAsRead = async () => {
    const { data } = await createReaction();

    if (data.createReaction) {
      const { createReaction: reaction } = data;

      markLocalResourceAsRead(reaction);
      markWorkspaceResourceAsRead();
      decrementResourceBadgeCounts();
      markLocalNotificationsAsRead();

      return Promise.resolve();
    }

    return Promise.reject(
      new Error('Unable to create viewed reaction for resource')
    );
  };

  return markAsRead;
};

export default useViewedReaction;
