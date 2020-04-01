import { useMutation } from '@apollo/react-hooks';
import Pluralize from 'pluralize';

import addMemberMutation from 'graphql/mutations/addMember';
import removeMemberMutation from 'graphql/mutations/removeMember';
import localAddMemberMutation from 'graphql/mutations/local/addMember';
import localRemoveMemberMutation from 'graphql/mutations/local/removeMember';
import addToWorkspaceMtn from 'graphql/mutations/addToWorkspace';
import removeFromWorkspaceMtn from 'graphql/mutations/removeFromWorkspace';
import localAddToWorkspaceMtn from 'graphql/mutations/local/addToWorkspace';
import localRemoveFromWorkspaceMtn from 'graphql/mutations/local/removeFromWorkspace';
import { DEFAULT_ACCESS_TYPE } from 'utils/constants';
import { snakedQueryParams } from 'utils/queryParams';
import buildResource from 'utils/resourceHelpers';

const useResourceAccessMutations = (resourceType, resourceId) => {
  const resourceMembersType = Pluralize(resourceType);
  const [addMember] = useMutation(addMemberMutation, {
    variables: { resourceType: resourceMembersType },
  });
  const [localAddMember] = useMutation(localAddMemberMutation, {
    variables: { resourceType: resourceMembersType },
  });

  const [removeMember] = useMutation(removeMemberMutation, {
    variables: {
      resourceType: resourceMembersType,
      resourceId,
    },
  });
  const [localRemoveMember] = useMutation(localRemoveMemberMutation, {
    variables: {
      resourceType,
      resourceId,
    },
  });

  const [addToWorkspace] = useMutation(addToWorkspaceMtn, {
    variables: { input: { resourceType, resourceId } },
  });
  const [localAddToWorkspace] = useMutation(localAddToWorkspaceMtn);

  const [removeFromWorkspace] = useMutation(removeFromWorkspaceMtn, {
    variables: { queryParams: snakedQueryParams({ resourceType, resourceId }) },
  });
  const [localRemoveFromWorkspace] = useMutation(localRemoveFromWorkspaceMtn);

  const handleAddMember = (user, newResourceId) => {
    const rId = resourceId || newResourceId;
    addMember({
      variables: {
        resourceId: rId,
        input: {
          userId: user.id,
          accessType: DEFAULT_ACCESS_TYPE,
        },
      },
    });

    localAddMember({
      variables: {
        resourceId: rId,
        user,
        accessType: DEFAULT_ACCESS_TYPE,
      },
    });
  };

  const handleRemoveMember = userId => {
    removeMember({ variables: { userId } });
    localRemoveMember({ variables: { userId } });
  };

  const handleAddToWorkspace = (workspaceId, newResourceId) => {
    const resource = buildResource(resourceType, resourceId || newResourceId);
    addToWorkspace({ variables: { workspaceId } });
    localAddToWorkspace({ variables: { resource, workspaceId } });
  };

  const handleRemoveFromWorkspace = workspaceId => {
    const resource = buildResource(resourceType, resourceId);
    removeFromWorkspace({ variables: { workspaceId } });
    localRemoveFromWorkspace({ variables: { resource } });
  };

  return {
    handleAddMember,
    handleRemoveMember,
    handleAddToWorkspace,
    handleRemoveFromWorkspace,
  };
};

export default useResourceAccessMutations;
