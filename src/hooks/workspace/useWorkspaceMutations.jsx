import { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import workspacesQuery from 'graphql/queries/workspaces';
import createWorkspaceMtn from 'graphql/mutations/createWorkspace';
import updateWorkspaceMtn from 'graphql/mutations/updateWorkspace';
import { WORKSPACES_QUERY_SIZE } from 'utils/constants';
import { WorkspaceContext } from 'utils/contexts';
import { getLocalUser } from 'utils/auth';
import { track } from 'utils/analytics';
import { snakedQueryParams } from 'utils/queryParams';

const useWorkspaceMutations = () => {
  const { workspaceId } = useContext(WorkspaceContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId: currentUserId } = getLocalUser();

  const [createWorkspace] = useMutation(createWorkspaceMtn);
  const [updateWorkspace] = useMutation(updateWorkspaceMtn);

  const handleCreateWorkspace = async ({ title }) => {
    setIsSubmitting(true);

    const { data } = await createWorkspace({
      variables: { input: { title } },
      refetchQueries: [
        {
          query: workspacesQuery,
          variables: {
            userId: currentUserId,
            queryParams: snakedQueryParams({ size: WORKSPACES_QUERY_SIZE }),
          },
        },
      ],
    });

    if (data.createWorkspace) {
      const { id } = data.createWorkspace;
      track('New workspace created', { workspaceId: id });

      setIsSubmitting(false);
      return Promise.resolve({ id });
    }

    return Promise.reject(new Error('Failed to create new workspace'));
  };

  const handleUpdateWorkspaceTitle = async title => {
    const { data } = await updateWorkspace({
      variables: { workspaceId, input: { title } },
    });

    if (data.updateWorkspace) {
      track('Workspace title updated', { workspaceId });
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update workspace title'));
  };

  return {
    isSubmitting,

    handleCreateWorkspace,
    handleUpdateWorkspaceTitle,
  };
};

export default useWorkspaceMutations;
