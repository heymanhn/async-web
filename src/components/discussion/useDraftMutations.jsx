/* eslint no-alert: 0 */
import { useContext } from 'react';
import { useApolloClient, useMutation } from 'react-apollo';

import discussionQuery from 'graphql/queries/discussion';
import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import createMessageDraftMutation from 'graphql/mutations/createMessageDraft';
import deleteMessageDraftMutation from 'graphql/mutations/deleteMessageDraft';
import localAddDraftToDiscussionMtn from 'graphql/mutations/local/addDraftToDiscussion';
import localDeleteDraftFromDiscMtn from 'graphql/mutations/local/deleteDraftFromDiscussion';
import { DocumentContext, DiscussionContext } from 'utils/contexts';

import { toPlainText } from 'components/editor/utils';
import useDiscussionMutations from './useDiscussionMutations';

/*
 * SLATE UPGRADE TODO:
 * - remove the draft from the discussion in local cache instead of refetching
 */

const useDraftMutations = (editor = null) => {
  const client = useApolloClient();
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);
  const { handleCreate } = useDiscussionMutations();

  const [createMessageDraft] = useMutation(createMessageDraftMutation);
  const [localAddDraftToDiscussion] = useMutation(localAddDraftToDiscussionMtn);

  const [deleteMessageDraft] = useMutation(deleteMessageDraftMutation, {
    variables: { discussionId },
  });
  const [deleteDiscussion] = useMutation(deleteDiscussionMutation, {
    variables: { documentId, discussionId },
  });
  const [localRemoveDraftFromDscn] = useMutation(localDeleteDraftFromDiscMtn, {
    variables: { discussionId },
  });

  async function handleSaveDraft() {
    const { children } = editor;

    let draftDiscussionId = discussionId;
    if (!draftDiscussionId) {
      const { discussionId: did } = await handleCreate();
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

      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to save message draft'));
  }

  async function handleDeleteDraft() {
    const { data } = await deleteMessageDraft();

    if (data.deleteMessageDraft) {
      localRemoveDraftFromDscn();

      const {
        discussion: { messageCount },
      } = client.readQuery({
        query: discussionQuery,
        variables: { discussionId, queryParams: {} },
      });

      if (!messageCount) {
        // SLATE UPGRADE TODO: Delete highlight from text

        await deleteDiscussion();
      }

      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to delete message draft'));
  }

  return {
    handleSaveDraft,
    handleDeleteDraft,
  };
};

export default useDraftMutations;
