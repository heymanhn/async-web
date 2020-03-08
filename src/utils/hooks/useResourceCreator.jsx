import { navigate } from '@reach/router';

import useDocumentMutations from 'utils/hooks/useDocumentMutations';
import useDiscussionMutations from 'utils/hooks/useDiscussionMutations';

const useResourceCreator = resource => {
  const {
    handleCreate: handleCreateDocument,
    isSubmitting: isSubmittingDocument,
  } = useDocumentMutations();
  const {
    handleCreate: handleCreateDiscussion,
    isSubmitting: isSubmittingDiscussion,
  } = useDiscussionMutations();

  const handleCreate =
    resource === 'documents' ? handleCreateDocument : handleCreateDiscussion;
  const isSubmitting =
    resource === 'documents' ? isSubmittingDocument : isSubmittingDiscussion;

  const handleCreateResource = async openInNewTab => {
    const data = await handleCreate();
    const resourceId =
      resource === 'documents' ? data.documentId : data.discussionId;

    if (resourceId) {
      const path = `/${resource}/${resourceId}`;
      if (openInNewTab) {
        window.open(path, '_blank');
      } else {
        navigate(path);
      }
    }

    return Promise.resolve();
  };

  return { handleCreateResource, isSubmitting };
};

export default useResourceCreator;
