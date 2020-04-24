import { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import inboxQuery from 'graphql/queries/inbox';
import createDiscussionMutation from 'graphql/mutations/createDiscussion';
import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import { track } from 'utils/analytics';
import { getLocalUser } from 'utils/auth';
import { DiscussionContext } from 'utils/contexts';

const useDiscussionMutations = () => {
  const {
    discussionId,
    afterCreateDiscussion,
    afterDeleteDiscussion,
  } = useContext(DiscussionContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = getLocalUser();

  const [createDiscussion] = useMutation(createDiscussionMutation);
  const [updateDiscussion] = useMutation(updateDiscussionMutation);
  const [deleteDiscussion] = useMutation(deleteDiscussionMutation);

  const handleCreateDiscussion = async ({ title }) => {
    setIsSubmitting(true);

    const input = {};
    if (title) input.title = title;

    const { data } = await createDiscussion({
      variables: { input },
      refetchQueries: [
        {
          query: inboxQuery,
          variables: { userId, queryParams: { type: 'all' } },
        },
        {
          query: inboxQuery,
          variables: { userId, queryParams: { type: 'discussion' } },
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

  const handleUpdateDiscussionTitle = async title => {
    const { data } = await updateDiscussion({
      variables: {
        discussionId,
        input: {
          title,
        },
      },
    });

    if (data.updateDiscussion) {
      track('Discussion title updated', { discussionId });
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update discussion title'));
  };

  // TODO (DISCUSSION V2): this also handles deleting threads, for now...
  const handleDeleteDiscussion = async ({ parentId } = {}) => {
    const { data } = await deleteDiscussion({
      variables: { discussionId: parentId || discussionId },
    });

    if (data.deleteDiscussion) {
      afterDeleteDiscussion();
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
