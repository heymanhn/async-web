import { useContext, useState } from 'react';
import { useMutation } from 'react-apollo';

import createDiscussionMutation from 'graphql/mutations/createDiscussion';
import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import { DocumentContext, DiscussionContext } from 'utils/contexts';
import { track } from 'utils/analytics';

import { deserializeString, toPlainText } from 'components/editor/utils';

const useDiscussionMutations = () => {
  const { discussionId, afterDelete } = useContext(DiscussionContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    const { data } = await createDiscussion({
      variables: { input },
    });

    if (data.createDiscussion) {
      const { id: newDiscussionId } = data.createDiscussion;
      track('New discussion created', {
        documentId,
        discussionId: newDiscussionId,
      });

      afterCreate(newDiscussionId);
      setIsSubmitting(false);

      return Promise.resolve({ discussionId: newDiscussionId });
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
    const { data } = await deleteDiscussion();

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
