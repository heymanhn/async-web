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

  const handleCreateResource = async () => {
    const data = await handleCreate();
    const resourceId =
      resource === 'documents' ? data.documentId : data.discussionId;

    if (resourceId) {
      window.open(`/${resource}/${resourceId}`, '_blank');
    }
  };

  return { handleCreateResource, isSubmitting };
};

export default useResourceCreator;
