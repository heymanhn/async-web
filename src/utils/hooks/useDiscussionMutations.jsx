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
  const { documentId } = useContext(DocumentContext);
  const { context, discussionId, afterCreate, afterDelete } = useContext(
    DiscussionContext
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = getLocalUser();

  const [createDiscussion] = useMutation(createDiscussionMutation);
  const [updateDiscussion] = useMutation(updateDiscussionMutation);
  const [deleteDiscussion] = useMutation(deleteDiscussionMutation, {
    variables: { discussionId },
  });

  const handleCreate = async title => {
    setIsSubmitting(true);

    const input = {};

    if (documentId) {
      input.parent = { id: documentId, type: 'document' };
    } else if (discussionId) {
      input.parent = { id: discussionId, type: 'discussion' };
    }

    if (title) {
      input.topic = {
        formatter: 'slatejs',
        text: title,
      };
    } else if (context) {
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

  // Only used for inline discussions
  const handleUpdateContext = async newContext => {
    const { data } = await updateDiscussion({
      variables: {
        discussionId,
        input: {
          topic: {
            formatter: 'slatejs',
            text: toPlainText(newContext),
            payload: JSON.stringify(newContext),
          },
        },
      },
    });

    if (data.updateDiscussion) {
      track('Inline discussion context updated', { discussionId });
      return Promise.resolve();
    }

    return Promise.reject(
      new Error('Failed to update inline discussion context')
    );
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
    handleUpdateContext,
    handleUpdateTopic,
    handleDelete,

    isSubmitting,
  };
};

export default useDiscussionMutations;
