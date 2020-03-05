import { useContext } from 'react';
import { useApolloClient, useMutation } from 'react-apollo';

import discussionQuery from 'graphql/queries/discussion';
import createMessageDraftMutation from 'graphql/mutations/createMessageDraft';
import deleteMessageDraftMutation from 'graphql/mutations/deleteMessageDraft';
import localAddDraftToDiscussionMtn from 'graphql/mutations/local/addDraftToDiscussion';
import localDeleteDraftFromDiscMtn from 'graphql/mutations/local/deleteDraftFromDiscussion';
import useDiscussionMutations from 'utils/hooks/useDiscussionMutations';
import { DiscussionContext } from 'utils/contexts';

import { toPlainText } from 'components/editor/utils';

const useDraftMutations = (editor = null) => {
  const client = useApolloClient();
  const { discussionId, afterCreateDraft } = useContext(DiscussionContext);
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
    const { children } = editor;

    let draftDiscussionId = discussionId;
    if (!draftDiscussionId) {
      const { discussionId: did } = await handleCreateDiscussion();
      draftDiscussionId = did;
    }

    const { data } = await createMessageDraft({
      variables: {
        discussionId: draftDiscussionId,
        input: {
          body: {
            formatter: 'slatejs',
            text: toPlainText(children),
            payload: JSON.stringify(children),
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

      return Promise.resolve();
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
  };
};

export default useDraftMutations;
