import { useContext } from 'react';
import { useMutation } from 'react-apollo';

import createDiscussionMutation from 'graphql/mutations/createDiscussion';
// import deleteDiscussionMutation from 'graphql/mutations/deleteDiscussion';
import { DocumentContext, DiscussionContext } from 'utils/contexts';
import { track } from 'utils/analytics';

import { toPlainText } from 'components/editor/utils';

const useDiscussionMutations = () => {
  const [createDiscussion] = useMutation(createDiscussionMutation);
  // SLATE UPGRADE TODO: what do I need this for again?
  // const [deleteDiscussion] = useMutation(deleteDiscussionMutation, {
  //   variables: { documentId, discussionId },
  // });

  const { documentId } = useContext(DocumentContext);
  const { context, afterCreate } = useContext(DiscussionContext);

  async function handleCreate() {
    const input = documentId ? { documentId } : {};
    if (context) {
      input.topic = {
        formatter: 'slatejs',
        text: toPlainText(context),
        payload: JSON.stringify(context),
      };
    }

    const { data: createDiscussionData } = await createDiscussion({
      variables: { input },
    });

    if (createDiscussionData.createDiscussion) {
      const { id: newDiscussionId } = createDiscussionData.createDiscussion;
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
