import { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import discussionQuery from 'graphql/queries/discussion';
import documentThreadsQuery from 'graphql/queries/documentThreads';
import createMessageMutation from 'graphql/mutations/createMessage';
import updateMessageMutation from 'graphql/mutations/updateMessage';
import deleteMessageMutation from 'graphql/mutations/deleteMessage';
import localDeleteMessageMutation from 'graphql/mutations/local/deleteMessageFromDiscussion';
import addNewMsgMutation from 'graphql/mutations/local/addNewMessageToDiscussionMessages';
import useDiscussionMutations from 'hooks/discussion/useDiscussionMutations';
import useRefetchWorkspaceResources from 'hooks/resources/useRefetchWorkspaceResources';
import { track } from 'utils/analytics';
import { DocumentContext, MessageContext } from 'utils/contexts';
import { toPlainText } from 'utils/editor/constants';
import trimContent from 'utils/editor/helpers';

const useMessageMutations = ({ message = null } = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { documentId } = useContext(DocumentContext);
  const {
    messageId,
    parentId,
    afterUpdateMessage,
    afterCreateMessage,
  } = useContext(MessageContext);
  const { handleCreateDiscussion } = useDiscussionMutations();
  const checkRefetchWorkspaceResources = useRefetchWorkspaceResources({
    resourceType: documentId ? 'document' : 'discussion',
    resourceId: documentId || parentId,
  });

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

    const workspaceResourceQueries = await checkRefetchWorkspaceResources();
    const refetchQueries = [
      {
        query: discussionQuery,
        variables: { discussionId: messageDiscussionId },
      },
      ...workspaceResourceQueries,
    ];
    if (!parentId && documentId) {
      refetchQueries.push({
        query: documentThreadsQuery,
        variables: { id: documentId, queryParams: { order: 'desc' } },
      });
    }

    const trimmedMessage = trimContent(message);
    const { data } = await createMessage({
      variables: {
        discussionId: messageDiscussionId,
        input: {
          body: {
            formatter: 'slatejs',
            text: toPlainText(trimmedMessage),
            payload: JSON.stringify(trimmedMessage),
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

    const trimmedMessage = trimContent(newMessage || message);
    const { data } = await updateMessage({
      variables: {
        discussionId: parentId,
        messageId,
        input: {
          body: {
            formatter: 'slatejs',
            text: toPlainText(trimmedMessage),
            payload: JSON.stringify(trimmedMessage),
          },
        },
      },
    });

    if (data.updateMessage) {
      setIsSubmitting(false);
      afterUpdateMessage();
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
