import { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import inboxQuery from 'graphql/queries/inbox';
import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import createDiscussionMutation from 'graphql/mutations/createDiscussion';
import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import { track } from 'utils/analytics';
import { getLocalUser } from 'utils/auth';
import {
  DocumentContext,
  DiscussionContext,
  ThreadContext,
  MessageContext,
} from 'utils/contexts';
import { toPlainText } from 'utils/editor/constants';

// TODO (DISCUSSION V2): To make this easier on us, better idea is to have
// a separate useThreadMutations hook.
const useDiscussionMutations = () => {
  const { documentId } = useContext(DocumentContext);
  const {
    discussionId,
    afterCreate,
    afterDelete: afterDeleteDiscussion,
  } = useContext(DiscussionContext);
  const { threadId, topic, afterDelete: afterDeleteThread } = useContext(
    ThreadContext
  );
  const { messageId } = useContext(MessageContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = getLocalUser();

  const [createDiscussion] = useMutation(createDiscussionMutation);
  const [updateDiscussion] = useMutation(updateDiscussionMutation);
  const [deleteDiscussion] = useMutation(deleteDiscussionMutation, {
    variables: { discussionId: discussionId || threadId },
  });

  const handleCreate = async title => {
    setIsSubmitting(true);

    const input = {};

    if (documentId) {
      input.parent = { id: documentId, type: 'document' };
    } else if (messageId) {
      input.parent = { id: messageId, type: 'message' };
    }

    if (title) {
      input.title = title;
    } else if (topic) {
      input.topic = {
        formatter: 'slatejs',
        text: toPlainText(topic),
        payload: JSON.stringify(topic),
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
  // TODO (DISCUSSION V2): Change to topic
  const handleUpdateContext = async newContext => {
    const { data } = await updateDiscussion({
      variables: {
        discussionId: threadId,
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
  const handleUpdateTopic = async title => {
    const { data } = await updateDiscussion({
      variables: {
        discussionId,
        input: {
          title,
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
      // TODO (DISCUSSION V2): clean this up once we have two separate hooks.
      afterDeleteDiscussion();
      afterDeleteThread();
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
