/* eslint no-alert: 0 */
import { useContext } from 'react';
import { useMutation } from 'react-apollo';

// import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import createMessageDraftMutation from 'graphql/mutations/createMessageDraft';
// import deleteMessageDraftMutation from 'graphql/mutations/deleteMessageDraft';
import localAddDraftToDiscussionMtn from 'graphql/mutations/local/addDraftToDiscussion';
import { DiscussionContext } from 'utils/contexts';

import { toPlainText } from 'components/editor/utils';
import useDiscussionMutations from './useDiscussionMutations';

/*
 * SLATE UPGRADE TODO:
 */

const useDraftMutations = editor => {
  const { discussionId } = useContext(DiscussionContext);
  const { handleCreate } = useDiscussionMutations();

  const [createMessageDraft] = useMutation(createMessageDraftMutation);
  const [localAddDraftToDiscussion] = useMutation(localAddDraftToDiscussionMtn);
  // const [deleteMessageDraft] = useMutation(deleteMessageDraftMutation, {
  //   variables: { discussionId },
  //   refetchQueries: [
  //     {
  //       query: discussionQuery,
  //       variables: { discussionId, queryParams: {} },
  //     },
  //   ],
  //   awaitRefetchQueries: true,
  // });

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

  // async function handleDeleteDraft() {
  //   const { data } = await deleteMessageDraft();

  //   if (data.deleteMessageDraft) {
  //     const {
  //       discussion: { messageCount },
  //     } = client.readQuery({
  //       query: discussionQuery,
  //       variables: { id: discussionId, queryParams: {} },
  //     });

  //     if (!messageCount) {
  //       // TODO (HN): Delete highlight from text

  //       await client.mutate({
  //         mutation: deleteDiscussionMutation,

  //         refetchQueries: [
  //           {
  //             query: documentDiscussionsQuery,
  //             variables: { id: documentId, queryParams: { order: 'desc' } },
  //           },
  //         ],
  //         awaitRefetchQueries: true,
  //       });
  //       onCancel({ closeModal: true });
  //     }

  //     return Promise.resolve();
  //   }

  //   return Promise.reject(new Error('Failed to delete message draft'));
  // }

  return {
    handleSaveDraft,
    // handleDeleteDraft,
  };
};

export default useDraftMutations;
