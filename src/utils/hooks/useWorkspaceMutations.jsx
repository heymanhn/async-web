import { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import workspaceQuery from 'graphql/queries/workspace';
import workspacesQuery from 'graphql/queries/workspaces';
import createWorkspaceMtn from 'graphql/mutations/createWorkspace';
import updateWorkspaceMtn from 'graphql/mutations/updateWorkspace';
import addMemberMutation from 'graphql/mutations/addMember';
import { DEFAULT_ACCESS_TYPE, WORKSPACES_QUERY_SIZE } from 'utils/constants';
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
  const [addMember] = useMutation(addMemberMutation);

  const handleCreate = async title => {
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
      const { id: newWorkspaceId } = data.createWorkspace;
      track('New workspace created', { workspaceId: newWorkspaceId });

      setIsSubmitting(false);
      return Promise.resolve({ workspaceId: newWorkspaceId });
    }

    return Promise.reject(new Error('Failed to create new workspace'));
  };

  const handleUpdateTitle = async title => {
    const { data } = await updateWorkspace({
      variables: { workspaceId, input: { title } },
    });

    if (data.updateWorkspace) {
      track('Workspace title updated', { workspaceId });
      // afterUpdate();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update workspace title'));
  };

  const handleAddMember = async (wsId, userId) => {
    setIsSubmitting(true);

    const { data } = await addMember({
      variables: {
        resourceType: 'workspaces',
        id: workspaceId || wsId,
        input: {
          userId,
          accessType: DEFAULT_ACCESS_TYPE,
        },
      },
      refetchQueries: [
        {
          query: workspaceQuery,
          variables: { id: workspaceId || wsId },
        },
      ],
    });

    setIsSubmitting(false);
    if (data.addMember) return Promise.resolve();

    return Promise.reject(new Error('Failed to add member to workspace'));
  };

  return {
    isSubmitting,

    handleCreate,
    handleUpdateTitle,
    handleAddMember,
  };
};

export default useWorkspaceMutations;
