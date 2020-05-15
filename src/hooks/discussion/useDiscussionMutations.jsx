import { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import resourcesQuery from 'graphql/queries/resources';
import createDiscussionMutation from 'graphql/mutations/createDiscussion';
import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import localDeleteUserResourceMtn from 'graphql/mutations/local/deleteUserResource';
import useRefetchWorkspaceResources from 'hooks/resources/useRefetchWorkspaceResources';
import { track } from 'utils/analytics';
import { getLocalUser } from 'utils/auth';
import { RESOURCES_QUERY_SIZE } from 'utils/constants';
import { DiscussionContext, ThreadContext } from 'utils/contexts';
import { snakedQueryParams } from 'utils/queryParams';

const useDiscussionMutations = () => {
  const {
    discussionId,
    afterCreateDiscussion,
    afterDeleteDiscussion,
  } = useContext(DiscussionContext);
  const { afterDeleteThread } = useContext(ThreadContext);
  const checkRefetchWorkspaceResources = useRefetchWorkspaceResources({
    resourceType: 'discussion',
    resourceId: discussionId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createDiscussion] = useMutation(createDiscussionMutation);
  const [updateDiscussion] = useMutation(updateDiscussionMutation);
  const [deleteDiscussion] = useMutation(deleteDiscussionMutation);
  const [localDeleteUserResource] = useMutation(localDeleteUserResourceMtn);

  const handleCreateDiscussion = async ({ title }) => {
    setIsSubmitting(true);

    const input = {};
    if (title) input.title = title;

    const { userId } = getLocalUser();
    const { data } = await createDiscussion({
      variables: { input },
      refetchQueries: [
        {
          query: resourcesQuery,
          variables: {
            userId,
            queryParams: snakedQueryParams({ size: RESOURCES_QUERY_SIZE }),
          },
        },
      ],
    });

    if (data.createDiscussion) {
      const { id } = data.createDiscussion;
      track('New discussion created', { discussionId: id });

      afterCreateDiscussion(id);
      setIsSubmitting(false);

      return Promise.resolve({ id });
    }

    return Promise.reject(new Error('Failed to create discussion'));
  };

  // Refetch workspace resources if the discussion belongs to one
  const handleUpdateDiscussionTitle = async title => {
    const refetchQueries = await checkRefetchWorkspaceResources();
    const { data } = await updateDiscussion({
      variables: {
        discussionId,
        input: {
          title,
        },
      },
      refetchQueries,
    });

    if (data.updateDiscussion) {
      track('Discussion title updated', { discussionId });
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update discussion title'));
  };

  // TODO (DISCUSSION V2): this also handles deleting threads, for now...
  // DRY this up later.
  const handleDeleteDiscussion = async ({ parentId } = {}) => {
    let refetchQueries = [];

    if (!parentId) refetchQueries = await checkRefetchWorkspaceResources();
    const { data } = await deleteDiscussion({
      variables: { discussionId: parentId || discussionId },
      refetchQueries,
    });

    if (data.deleteDiscussion) {
      if (!parentId) {
        localDeleteUserResource({ variables: { resourceId: discussionId } });
        afterDeleteDiscussion();
      } else {
        afterDeleteThread();
      }

      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to delete discussion'));
  };

  return {
    handleCreateDiscussion,
    handleUpdateDiscussionTitle,
    handleDeleteDiscussion,

    isSubmitting,
  };
};

export default useDiscussionMutations;
