/* eslint no-alert: 0 */
import { useContext, useState } from 'react';
import { useMutation } from 'react-apollo';

import discussionQuery from 'graphql/queries/discussion';
import createMessageMutation from 'graphql/mutations/createMessage';
import updateMessageMutation from 'graphql/mutations/updateMessage';
import deleteMessageMutation from 'graphql/mutations/deleteMessage';
import localDeleteMessageMutation from 'graphql/mutations/local/deleteMessageFromDiscussion';
import { track } from 'utils/analytics';
import { DiscussionContext, MessageContext } from 'utils/contexts';

import { toPlainText } from 'components/editor/utils';

/*
 * SLATE UPGRADE TODO:
 * - Pass message details into this hook so that the API calls can use it
 * - Handle deleting the entire discussion if the user deletes the first
 *   message of the discussion
 */

const useMessageMutations = ({
  message = null,
  afterCreate = () => {},
} = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { documentId, discussionId, context } = useContext(DiscussionContext);
  const { messageId, setMode } = useContext(MessageContext);

  const [createMessage] = useMutation(createMessageMutation);
  const [updateMessage] = useMutation(updateMessageMutation);

  const [deleteMessage] = useMutation(deleteMessageMutation, {
    variables: { discussionId, messageId },
  });
  const [localDeleteMessage] = useMutation(localDeleteMessageMutation, {
    variables: { discussionId, messageId },
  });

  async function handleCreateDiscussion() {
    const input = {};
    if (context) {
      const initialJSON = JSON.parse(context);
      const value = Value.fromJSON(initialJSON);

      input.topic = {
        formatter: 'slatejs',
        text: toPlainText(),
        payload: context,
      };
    }

    const { data: createDiscussionData } = await createDiscussion({
      variables: { documentId, input },
      refetchQueries: [
        {
          query: documentDiscussionsQuery,
          variables: { id: documentId, queryParams: { order: 'desc' } },
        },
      ],
      awaitRefetchQueries: true,
    });

    if (createDiscussionData.createDiscussion) {
      const { id: newDiscussionId } = createDiscussionData.createDiscussion;
      return Promise.resolve({
        discussionId: newDiscussionId,
        isNewDiscussion: true,
      });
    }

    return Promise.reject(new Error('Failed to create discussion'));
  }

  async function handleCreate() {
    setIsSubmitting(true);

    let messageDiscussionId = discussionId;
    if (!messageDiscussionId) {
      const { discussionId: newDiscussionId } = await handleCreateDiscussion();
      messageDiscussionId = newDiscussionId;
    }

    const { data } = await createMessage({
      variables: {
        discussionId: messageDiscussionId,
        input: {
          body: {
            formatter: 'slatejs',
            text: toPlainText(message),
            payload: message,
          },
        },
      },
      refetchQueries: [
        {
          query: discussionQuery,
          variables: { discussionId: messageDiscussionId, queryParams: {} },
        },
      ],
      awaitRefetchQueries: true,
    });

    if (data.createMessage) {
      const { id } = data.createMessage;
      setIsSubmitting(false);
      track('New message posted', {
        messageId: id,
        discussionId: messageDiscussionId,
      });
      // TODO: check if this is still needed.
      // afterCreate(messageDiscussionId, false);
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
            payload: message,
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

useMessageMutations.propTypes = {};

export default useMessageMutations;
