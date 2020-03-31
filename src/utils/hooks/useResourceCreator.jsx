import { useMutation } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import Pluralize from 'pluralize';

import workspaceResourcesQuery from 'graphql/queries/workspaceResources';
import addToWorkspaceMtn from 'graphql/mutations/addToWorkspace';
import useDocumentMutations from 'utils/hooks/useDocumentMutations';
import useDiscussionMutations from 'utils/hooks/useDiscussionMutations';

const useResourceCreator = resourceType => {
  const {
    handleCreate: handleCreateDocument,
    isSubmitting: isSubmittingDocument,
  } = useDocumentMutations();
  const {
    handleCreate: handleCreateDiscussion,
    isSubmitting: isSubmittingDiscussion,
  } = useDiscussionMutations();
  const [addToWorkspace] = useMutation(addToWorkspaceMtn);

  const handleCreate =
    resourceType === 'document' ? handleCreateDocument : handleCreateDiscussion;
  const isSubmitting =
    resourceType === 'document' ? isSubmittingDocument : isSubmittingDiscussion;

  const handleAddResourceToWorkspace = async (resourceId, workspaceId) => {
    const { data } = await addToWorkspace({
      variables: {
        workspaceId,
        input: { resourceType, resourceId },
      },
      refetchQueries: [
        {
          query: workspaceResourcesQuery,
          variables: { workspaceId, queryParams: { type: 'all' } },
        },
        {
          query: workspaceResourcesQuery,
          variables: { workspaceId, queryParams: { type: resourceType } },
        },
      ],
    });

    if (data.addToWorkspace) return Promise.resolve();

    return Promise.reject(new Error('Failed to add new resource to workspace'));
  };

  const handleCreateResource = async (workspaceId, openInNewTab) => {
    const data = await handleCreate();
    const resourceId =
      resourceType === 'document' ? data.documentId : data.discussionId;

    if (resourceId) {
      if (workspaceId)
        await handleAddResourceToWorkspace(resourceId, workspaceId);

      const path = `/${Pluralize(resourceType)}/${resourceId}`;
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
