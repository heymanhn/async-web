import { useContext, useState } from 'react';
import { useMutation } from 'react-apollo';

import createDiscussionMutation from 'graphql/mutations/createDiscussion';
import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import { DocumentContext, DiscussionContext } from 'utils/contexts';
import { track } from 'utils/analytics';

import { toPlainText } from 'components/editor/utils';

const useDiscussionMutations = () => {
  const { discussionId, afterDelete } = useContext(DiscussionContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createDiscussion] = useMutation(createDiscussionMutation);
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

    const { data: createDiscussionData } = await createDiscussion({
      variables: { input },
    });

    if (createDiscussionData.createDiscussion) {
      const { id: newDiscussionId } = createDiscussionData.createDiscussion;
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

  const handleDelete = async () => {
    const { data: deleteDiscussionData } = await deleteDiscussion();

    if (deleteDiscussionData.deleteDiscussion) {
      afterDelete();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to delete discussion'));
  };

  return {
    handleCreate,
    handleDelete,

    isSubmitting,
  };
};

export default useDiscussionMutations;
