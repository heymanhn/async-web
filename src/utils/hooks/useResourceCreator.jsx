import { useMutation } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import Pluralize from 'pluralize';

import workspaceResourcesQuery from 'graphql/queries/workspaceResources';
import addToWorkspaceMtn from 'graphql/mutations/addToWorkspace';
import useWorkspaceMutations from 'utils/hooks/useWorkspaceMutations';
import useDocumentMutations from 'utils/hooks/useDocumentMutations';
import useDiscussionMutations from 'utils/hooks/useDiscussionMutations';
import useResourceAccessMutations from 'utils/hooks/useResourceAccessMutations';
import { getLocalUser } from 'utils/auth';

const MUTATION_HOOKS = {
  workspace: useWorkspaceMutations,
  document: useDocumentMutations,
  discussion: useDiscussionMutations,
};

const useResourceCreator = resourceType => {
  const { handleAddMember } = useResourceAccessMutations(resourceType);
  const useResourceMutations = MUTATION_HOOKS[resourceType];
  const { handleCreate, isSubmitting } = useResourceMutations;

  const [addToWorkspace] = useMutation(addToWorkspaceMtn);

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

  const handleCreateResource = async ({
    title,
    parentWorkspaceId,
    newMembers,
    openInNewTab,
  }) => {
    const { id: resourceId } = await handleCreate(title);

    if (resourceId) {
      if (parentWorkspaceId)
        await handleAddResourceToWorkspace(resourceId, parentWorkspaceId);

      if (newMembers) {
        const { userId } = getLocalUser();
        newMembers
          .filter(m => m.user.id !== userId)
          .forEach(m => handleAddMember(m.user, resourceId));
      }

      const path = `/${Pluralize(resourceType)}/${resourceId}`;
      if (openInNewTab) {
        window.open(path, '_blank');
      } else {
        navigate(path);
      }

      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to create new resource'));
  };

  return { handleCreateResource, isSubmitting };
};

export default useResourceCreator;
