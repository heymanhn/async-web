import { useContext, useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

import discussionQuery from 'graphql/queries/discussion';
import createMessageDraftMutation from 'graphql/mutations/createMessageDraft';
import deleteMessageDraftMutation from 'graphql/mutations/deleteMessageDraft';
import localAddDraftToDiscussionMtn from 'graphql/mutations/local/addDraftToDiscussion';
import localDeleteDraftFromDiscMtn from 'graphql/mutations/local/deleteDraftFromDiscussion';
import useDiscussionMutations from 'hooks/discussion/useDiscussionMutations';
import { MessageContext } from 'utils/contexts';
import { DEFAULT_ELEMENT, toPlainText } from 'utils/editor/constants';
import useThreadMutations from 'hooks/thread/useThreadMutations';

const useMessageDraftMutations = () => {
  const client = useApolloClient();
  const { parentId } = useContext(MessageContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleDeleteDiscussion } = useDiscussionMutations();
  const { handleCreateThread } = useThreadMutations();

  const [createMessageDraft] = useMutation(createMessageDraftMutation);
  const [localAddDraftToDiscussion] = useMutation(localAddDraftToDiscussionMtn);

  const [deleteMessageDraft] = useMutation(deleteMessageDraftMutation, {
    variables: { discussionId: parentId },
  });

  const [localRemoveDraftFromDscn] = useMutation(localDeleteDraftFromDiscMtn, {
    variables: { discussionId: parentId },
  });

  // TODO (DISCUSSION V2): clarify this logic when renaming inline discussions
  // as threads
  const handleSaveMessageDraft = async ({
    content = DEFAULT_ELEMENT(),
    isThread,
    parentMessageId,
  } = {}) => {
    setIsSubmitting(true);

    let draftParentId = parentId;
    if (isThread) {
      const { id } = await handleCreateThread(parentMessageId);
      draftParentId = id;
    }

    const { data } = await createMessageDraft({
      variables: {
        discussionId: draftParentId,
        input: {
          body: {
            formatter: 'slatejs',
            text: toPlainText(content),
            payload: JSON.stringify(content),
          },
        },
      },
    });

    if (data.createMessageDraft) {
      localAddDraftToDiscussion({
        variables: {
          discussionId: draftParentId,
          draft: data.createMessageDraft,
        },
      });

      setIsSubmitting(false);
      return Promise.resolve({ discussionId: draftParentId });
    }

    return Promise.reject(new Error('Failed to save message draft'));
  };

  const handleDeleteMessageDraft = async () => {
    // Parent can be either a thread or a discussion
    const {
      discussion: { messageCount },
    } = client.readQuery({
      query: discussionQuery,
      variables: { discussionId: parentId },
    });

    // No need to delete the draft in this case. Just delete the
    // discussion or thread directly
    if (!messageCount) {
      handleDeleteDiscussion({ parentId });
      return Promise.resolve();
    }

    const { data } = await deleteMessageDraft();

    if (data.deleteMessageDraft) {
      localRemoveDraftFromDscn();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to delete message draft'));
  };

  return {
    handleSaveMessageDraft,
    handleDeleteMessageDraft,
    isSubmitting,
  };
};

export default useMessageDraftMutations;
