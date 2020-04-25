import { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import discussionQuery from 'graphql/queries/discussion';
import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import createMessageMutation from 'graphql/mutations/createMessage';
import updateMessageMutation from 'graphql/mutations/updateMessage';
import deleteMessageMutation from 'graphql/mutations/deleteMessage';
import localDeleteMessageMutation from 'graphql/mutations/local/deleteMessageFromDiscussion';
import addNewMsgMutation from 'graphql/mutations/local/addNewMessageToDiscussionMessages';
import useDiscussionMutations from 'hooks/discussion/useDiscussionMutations';
import { track } from 'utils/analytics';
import { DocumentContext, MessageContext } from 'utils/contexts';
import { toPlainText } from 'utils/editor/constants';

const useMessageMutations = ({ message = null } = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { documentId } = useContext(DocumentContext);
  const { messageId, parentId, setMode, afterCreateMessage } = useContext(
    MessageContext
  );
  const { handleCreateDiscussion } = useDiscussionMutations();

  const [createMessage] = useMutation(createMessageMutation);
  const [updateMessage] = useMutation(updateMessageMutation);

  const [deleteMessage] = useMutation(deleteMessageMutation, {
    variables: { discussionId: parentId, messageId },
  });
  const [localDeleteMessage] = useMutation(localDeleteMessageMutation, {
    variables: { discussionId: parentId, messageId },
  });
  const [localAddMessage] = useMutation(addNewMsgMutation);

  const handleCreateMessage = async () => {
    setIsSubmitting(true);

    // TODO (DISCUSSION V2): This shouldn't happen, now that all threads and
    // discussions are created before the first message is created. See if
    // we can delete this logic safely.
    let messageDiscussionId = parentId;
    if (!messageDiscussionId) {
      const { id } = await handleCreateDiscussion();
      messageDiscussionId = id;
    }

    const refetchQueries = [
      {
        query: discussionQuery,
        variables: { discussionId: messageDiscussionId },
      },
    ];
    if (!parentId && documentId) {
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
      localAddMessage({
        variables: {
          isUnread: false,
          message: data.createMessage,
        },
      });

      setIsSubmitting(false);
      track('New message posted', {
        messageId: id,
        discussionId: messageDiscussionId,
      });

      afterCreateMessage(messageDiscussionId);
    }
  };

  const handleUpdateMessage = async ({ newMessage } = {}) => {
    setIsSubmitting(true);

    const { data } = await updateMessage({
      variables: {
        discussionId: parentId,
        messageId,
        input: {
          body: {
            formatter: 'slatejs',
            text: toPlainText(newMessage || message),
            payload: JSON.stringify(newMessage || message),
          },
        },
      },
    });

    if (data.updateMessage) {
      setIsSubmitting(false);
      setMode('display');
      track('Message edited', { messageId, discussionId: parentId });
    }
  };

  const handleDeleteMessage = async () => {
    deleteMessage();
    localDeleteMessage();
  };

  return {
    handleCreateMessage,
    handleUpdateMessage,
    handleDeleteMessage,

    isSubmitting,
  };
};

export default useMessageMutations;