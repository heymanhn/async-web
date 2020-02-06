/* eslint no-alert: 0 */
import { useContext, useState } from 'react';
import { useMutation } from 'react-apollo';

import discussionQuery from 'graphql/queries/discussion';
import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import createMessageMutation from 'graphql/mutations/createMessage';
import updateMessageMutation from 'graphql/mutations/updateMessage';
import deleteMessageMutation from 'graphql/mutations/deleteMessage';
import localDeleteMessageMutation from 'graphql/mutations/local/deleteMessageFromDiscussion';
import { track } from 'utils/analytics';
import {
  DocumentContext,
  DiscussionContext,
  MessageContext,
} from 'utils/contexts';

import { toPlainText } from 'components/editor/utils';
import useDiscussionMutations from './useDiscussionMutations';

/*
 * SLATE UPGRADE TODO:
 * - Handle deleting the entire discussion if the user deletes the first
 *   message of the discussion
 */

const useMessageMutations = ({ message = null } = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);
  const { messageId, setMode, afterCreate } = useContext(MessageContext);
  const { handleCreate: handleCreateDiscussion } = useDiscussionMutations();

  const [createMessage] = useMutation(createMessageMutation);
  const [updateMessage] = useMutation(updateMessageMutation);

  const [deleteMessage] = useMutation(deleteMessageMutation, {
    variables: { discussionId, messageId },
  });
  const [localDeleteMessage] = useMutation(localDeleteMessageMutation, {
    variables: { discussionId, messageId },
  });

  async function handleCreate() {
    setIsSubmitting(true);

    let messageDiscussionId = discussionId;
    if (!messageDiscussionId) {
      const { discussionId: newDiscussionId } = await handleCreateDiscussion();
      messageDiscussionId = newDiscussionId;
    }

    const refetchQueries = [
      {
        query: discussionQuery,
        variables: { discussionId: messageDiscussionId, queryParams: {} },
      },
    ];
    if (!discussionId) {
      refetchQueries.push({
        query: documentDiscussionsQuery,
        variables: { id: documentId, queryParams: { order: 'desc' } },
      });
    }

    const { data } = await createMessage({
      variables: {
        discussionId: messageDiscussionId,
        input: {
          body: {
            formatter: 'slatejs',
            text: toPlainText(message),
            payload: JSON.stringify(message),
          },
        },
      },
      refetchQueries,
      awaitRefetchQueries: true,
    });

    if (data.createMessage) {
      const { id } = data.createMessage;
      setIsSubmitting(false);
      track('New message posted', {
        messageId: id,
        discussionId: messageDiscussionId,
      });
      afterCreate(messageDiscussionId);
    }
  }

  async function handleUpdate() {
    setIsSubmitting(true);

    const { data } = await updateMessage({
      variables: {
        discussionId,
        messageId,
        input: {
          body: {
            formatter: 'slatejs',
            text: toPlainText(message),
            payload: JSON.stringify(message),
          },
        },
      },
    });

    if (data.updateMessage) {
      setIsSubmitting(false);
      setMode('display');
      track('Message edited', { messageId, discussionId });
    }
  }

  function handleDelete() {
    const userChoice = window.confirm(
      'Are you sure you want to delete this message?'
    );
    if (!userChoice) return;

    deleteMessage();
    localDeleteMessage();
  }

  return {
    handleCreate,
    handleUpdate,
    handleDelete,

    isSubmitting,
  };
};

export default useMessageMutations;