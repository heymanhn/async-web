import { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import inboxQuery from 'graphql/queries/inbox';
import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import createDiscussionMutation from 'graphql/mutations/createDiscussion';
import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import { DocumentContext, DiscussionContext } from 'utils/contexts';
import { getLocalUser } from 'utils/auth';
import { track } from 'utils/analytics';

import { deserializeString, toPlainText } from 'components/editor/utils';

const useDiscussionMutations = () => {
  const { discussionId, afterDelete } = useContext(DiscussionContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = getLocalUser();

  const [createDiscussion] = useMutation(createDiscussionMutation);
  const [updateDiscussion] = useMutation(updateDiscussionMutation);
  const [deleteDiscussion] = useMutation(deleteDiscussionMutation, {
    variables: { discussionId },
  });

  const { documentId } = useContext(DocumentContext);
  const { context, afterCreate } = useContext(DiscussionContext);

  const handleCreate = async () => {
    setIsSubmitting(true);

    const input = documentId ? { documentId } : {};
    if (context) {
      input.topic = {
        formatter: 'slatejs',
        text: toPlainText(context),
        payload: JSON.stringify(context),
      };
    }

    // Only refetch if an adhoc discussion is being created
    const refetchQueries = [];
    if (!documentId) {
      refetchQueries.push(
        {
          query: inboxQuery,
          variables: { userId, queryParams: { type: 'all' } },
        },
        {
          query: inboxQuery,
          variables: { userId, queryParams: { type: 'discussion' } },
        }
      );
    }

    const { data } = await createDiscussion({
      variables: { input },
      refetchQueries,
    });

    if (data.createDiscussion) {
      const { id } = data.createDiscussion;
      track('New discussion created', {
        documentId,
        discussionId: id,
      });

      afterCreate(id);
      setIsSubmitting(false);

      return Promise.resolve({ id });
    }

    return Promise.reject(new Error('Failed to create discussion'));
  };

  // Only used for adhoc discussion topics
  const handleUpdateTopic = async text => {
    const { data } = await updateDiscussion({
      variables: {
        discussionId,
        input: {
          topic: {
            formatter: 'slatejs',
            text,
            payload: JSON.stringify(deserializeString(text)),
          },
        },
      },
    });

    if (data.updateDiscussion) {
      track('Discussion topic updated', { discussionId });
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update discussion topic'));
  };

  const handleDelete = async () => {
    const refetchQueries = [];
    if (documentId) {
      refetchQueries.push({
        query: documentDiscussionsQuery,
        variables: { id: documentId, queryParams: { order: 'desc' } },
      });
    }
    const { data } = await deleteDiscussion({ refetchQueries });

    if (data.deleteDiscussion) {
      afterDelete();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to delete discussion'));
  };

  return {
    handleCreate,
    handleUpdateTopic,
    handleDelete,

    isSubmitting,
  };
};

export default useDiscussionMutations;
