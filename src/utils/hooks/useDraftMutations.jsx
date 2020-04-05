import { useContext, useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

import discussionQuery from 'graphql/queries/discussion';
import createMessageDraftMutation from 'graphql/mutations/createMessageDraft';
import deleteMessageDraftMutation from 'graphql/mutations/deleteMessageDraft';
import localAddDraftToDiscussionMtn from 'graphql/mutations/local/addDraftToDiscussion';
import localDeleteDraftFromDiscMtn from 'graphql/mutations/local/deleteDraftFromDiscussion';
import useDiscussionMutations from 'utils/hooks/useDiscussionMutations';
import { DiscussionContext } from 'utils/contexts';

import { DEFAULT_ELEMENT, toPlainText } from 'components/editor/utils';

const useDraftMutations = (editor = null) => {
  const client = useApolloClient();
  const { discussionId, afterCreateDraft } = useContext(DiscussionContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleCreate: handleCreateDiscussion,
    handleDelete: handleDeleteDiscussion,
  } = useDiscussionMutations();

  const [createMessageDraft] = useMutation(createMessageDraftMutation);
  const [localAddDraftToDiscussion] = useMutation(localAddDraftToDiscussionMtn);

  const [deleteMessageDraft] = useMutation(deleteMessageDraftMutation, {
    variables: { discussionId },
  });

  const [localRemoveDraftFromDscn] = useMutation(localDeleteDraftFromDiscMtn, {
    variables: { discussionId },
  });

  const handleSaveDraft = async () => {
    setIsSubmitting(true);

    const { children } = editor || {};
    const content = children || DEFAULT_ELEMENT();

    let draftDiscussionId = discussionId;
    if (!draftDiscussionId) {
      const { id } = await handleCreateDiscussion();
      draftDiscussionId = id;
    }

    const { data } = await createMessageDraft({
      variables: {
        discussionId: draftDiscussionId,
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
          discussionId: draftDiscussionId,
          draft: data.createMessageDraft,
        },
      });

      afterCreateDraft(draftDiscussionId);

      setIsSubmitting(false);
      return Promise.resolve({ discussionId: draftDiscussionId });
    }

    return Promise.reject(new Error('Failed to save message draft'));
  };

  const handleDeleteDraft = async () => {
    const {
      discussion: { messageCount },
    } = client.readQuery({
      query: discussionQuery,
      variables: { discussionId },
    });

    // No need to delete the draft in this case. Just delete the
    // discussion directly
    if (!messageCount) {
      handleDeleteDiscussion();
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
    handleSaveDraft,
    handleDeleteDraft,
    isSubmitting,
  };
};

export default useDraftMutations;