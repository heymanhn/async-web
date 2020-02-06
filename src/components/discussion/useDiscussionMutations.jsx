import { useContext } from 'react';
import { useMutation } from 'react-apollo';

import createDocumentDiscussionMutation from 'graphql/mutations/createDocumentDiscussion';
// import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import { DocumentContext, DiscussionContext } from 'utils/contexts';
import { track } from 'utils/analytics';

/*
 * SLATE UPGRADE TODO
 * - When context is implemented, save it during discussion create
 */
const useDiscussionMutations = () => {
  const [createDocumentDiscussion] = useMutation(
    createDocumentDiscussionMutation
  );
  // const [deleteDiscussion] = useMutation(deleteDiscussionMutation, {
  //   variables: { documentId, discussionId },
  // });

  const { documentId } = useContext(DocumentContext);
  const { afterCreate } = useContext(DiscussionContext);

  async function handleCreate() {
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

    const { data: createDiscussionData } = await createDocumentDiscussion({
      variables: { documentId, input },
    });

    if (createDiscussionData.createDocumentDiscussion) {
      const {
        id: newDiscussionId,
      } = createDiscussionData.createDocumentDiscussion;
      track('New discussion created', {
        documentId,
        discussionId: newDiscussionId,
      });

      afterCreate(newDiscussionId);

      return Promise.resolve({ discussionId: newDiscussionId });
    }

    return Promise.reject(new Error('Failed to create discussion'));
  }

  return {
    handleCreate,
  };
};

export default useDiscussionMutations;
