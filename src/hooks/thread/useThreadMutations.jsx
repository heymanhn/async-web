/*
 * A thread is a discussion that users can start from text selections
 * in documents and discussion messages. There are some subtle differences
 * to the type of data saved for a thread, so they deserve their own
 * mutation methods.
 */
import { useContext, useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';

import messageQuery from 'graphql/queries/message';
import createDiscussionMutation from 'graphql/mutations/createDiscussion';
import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import { track } from 'utils/analytics';
import {
  DiscussionContext,
  DocumentContext,
  MessageContext,
  ThreadContext,
} from 'utils/contexts';
import { toPlainText } from 'utils/editor/constants';

const useThreadMutations = () => {
  const { documentId } = useContext(DocumentContext);
  const { messageId } = useContext(MessageContext);
  const { discussionId } = useContext(DiscussionContext);
  const { threadId, topic } = useContext(ThreadContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createDiscussion] = useMutation(createDiscussionMutation);
  const [updateDiscussion] = useMutation(updateDiscussionMutation);
  const [getMessage, { data: messageData }] = useLazyQuery(messageQuery);

  const handleCreateThread = async parentMessageId => {
    setIsSubmitting(true);
    const input = {};

    if (documentId) {
      input.parent = {
        type: 'document',
        id: documentId,
        contentParentType: 'document',
        contentParentId: documentId,
      };
    } else if (messageId) {
      input.parent = {
        type: 'discussion',
        id: discussionId,
        contentParentType: 'message',
        contentParentId: messageId,
      };
    }

    if (topic) {
      input.topic = {
        formatter: 'slatejs',
        text: toPlainText(topic),
        payload: JSON.stringify(topic),
      };
    } else if (parentMessageId) {
      getMessage({ variables: { discussionId, messageId: parentMessageId } });
      const { message: parentMessage } = messageData;
      input.topic = {
        ...parentMessage.body,
        metadata: {
          authorId: parentMessage.author.id,
          messageId: parentMessage.id,
        },
      };
    }

    const { data } = await createDiscussion({
      variables: { input },
    });

    if (data.createDiscussion) {
      const { id } = data.createDiscussion;
      track('New thread created', {
        documentId,
        discussionId: id,
      });

      setIsSubmitting(false);

      return Promise.resolve({ id });
    }

    return Promise.reject(new Error('Failed to create thread'));
  };

  const handleUpdateThreadTopic = async newTopic => {
    const { data } = await updateDiscussion({
      variables: {
        discussionId: threadId,
        input: {
          topic: {
            formatter: 'slatejs',
            text: toPlainText(newTopic),
            payload: JSON.stringify(newTopic),
          },
        },
      },
    });

    if (data.updateDiscussion) {
      track('Thread topic updated', { discussionId: threadId });
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update thread topic'));
  };
  return {
    handleCreateThread,
    handleUpdateThreadTopic,

    isSubmitting,
  };
};

export default useThreadMutations;
