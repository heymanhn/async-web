/* eslint no-alert: 0 */
import { useContext, useState } from 'react';
import { useMutation } from 'react-apollo';

import discussionQuery from 'graphql/queries/discussion';
import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import createDiscussionMutation from 'graphql/mutations/createDiscussion';
// import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import createMessageMutation from 'graphql/mutations/createMessage';
import updateMessageMutation from 'graphql/mutations/updateMessage';
import deleteMessageMutation from 'graphql/mutations/deleteMessage';
// import createMessageDraftMutation from 'graphql/mutations/createMessageDraft';
// import deleteMessageDraftMutation from 'graphql/mutations/deleteMessageDraft';
// import addDraftToDiscussionMtn from 'graphql/mutations/local/addDraftToDiscussion';
import localDeleteMessageMutation from 'graphql/mutations/local/deleteMessageFromDiscussion';
import { track } from 'utils/analytics';
import { DiscussionContext, MessageContext } from 'utils/contexts';

import { toPlainText } from 'components/editor/utils';

/*
 * SLATE UPGRADE TODO:
 * - Pass message details into this hook so that the API calls can use it
 * - Handle deleting the entire discussion if the user deletes the first
 *   message of the discussion
 * - When context is implemented, save it during discussion create
 */

const useMessageMutations = ({ message = null } = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { documentId, discussionId } = useContext(DiscussionContext);
  const { messageId, setMode, afterCreate, afterDiscussionCreate } = useContext(
    MessageContext
  );

  const [createDiscussion] = useMutation(createDiscussionMutation);
  // const [deleteDiscussion] = useMutation(deleteDiscussionMutation, {
  //   variables: { documentId, discussionId },
  // });

  const [createMessage] = useMutation(createMessageMutation);
  const [updateMessage] = useMutation(updateMessageMutation);

  const [deleteMessage] = useMutation(deleteMessageMutation, {
    variables: { discussionId, messageId },
  });
  const [localDeleteMessage] = useMutation(localDeleteMessageMutation, {
    variables: { discussionId, messageId },
  });

  // const [createMessageDraft] = useMutation(createMessageDraftMutation);
  // const [deleteMessageDraft] = useMutation(deleteMessageDraftMutation, {
  //   variables: { discussionId },
  //   refetchQueries: [
  //     {
  //       query: discussionQuery,
  //       variables: { id: discussionId, queryParams: {} },
  //     },
  //   ],
  //   awaitRefetchQueries: true,
  // });

  async function handleCreateDiscussion() {
    const input = {};
    // TODO: fix this when we implement extracting context
    // if (context) {
    //   const initialJSON = JSON.parse(context);
    //   const value = Value.fromJSON(initialJSON);

    //   input.topic = {
    //     formatter: 'slatejs',
    //     text: toPlainText(),
    //     payload: context,
    //   };
    // }

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
      track('New discussion created', {
        documentId,
        discussionId: newDiscussionId,
      });

      afterDiscussionCreate(newDiscussionId);
    }
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

  // async function handleSaveDraft({ payload, text }) {
  //   let draftDiscussionId = discussionId;
  //   if (!draftDiscussionId) {
  //     const { discussionId: did } = await onCreateDiscussion();
  //     draftDiscussionId = did;
  //   }

  //   const { data } = await client.mutate({
  //     mutation: createMessageDraftMutation,
  //     variables: {
  //       discussionId: draftDiscussionId,
  //       input: {
  //         body: {
  //           formatter: 'slatejs',
  //           text,
  //           payload,
  //         },
  //       },
  //     },
  //     update: (_cache, { data: { createMessageDraft } }) => {
  //       client.mutate({
  //         mutation: addDraftToDiscussionMtn,
  //         variables: {
  //           discussionId: draftDiscussionId,
  //           draft: createMessageDraft,
  //         },
  //       });
  //     },
  //   });

  //   if (data.createMessageDraft) {
  //     afterCreate(draftDiscussionId, true);
  //     return Promise.resolve();
  //   }

  //   return Promise.reject(new Error('Failed to save message draft'));
  // }

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
    handleCreate,
    handleUpdate,
    handleDelete,
    // handleSaveDraft,
    // handleDeleteDraft,

    isSubmitting,
  };
};

export default useMessageMutations;
