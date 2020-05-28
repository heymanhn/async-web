import resourceMembersQuery from 'graphql/queries/resourceMembers';

const addMember = (
  _root,
  { resourceType, resourceId, user, accessType },
  { client }
) => {
  const data = client.readQuery({
    query: resourceMembersQuery,
    variables: { resourceType, resourceId },
  });
  if (!data) return null;

  const { resourceMembers } = data;
  const { members, __typename } = resourceMembers;

  const newMember = {
    ...members[0],
    user,
    accessType,
  };

  client.writeQuery({
    query: resourceMembersQuery,
    variables: { resourceType, resourceId },
    data: {
      resourceMembers: {
        members: [...members, newMember],
        __typename,
      },
    },
  });

  return null;
};

const removeMember = (
  _root,
  { resourceType, resourceId, userId },
  { client }
) => {
  const data = client.readQuery({
    query: resourceMembersQuery,
    variables: { resourceType, resourceId },
  });
  if (!data) return null;

  const { resourceMembers } = data;
  const { members, __typename } = resourceMembers;

  const index = (members || []).findIndex(p => p.user.id === userId);
  if (index < 0) return null;

  client.writeQuery({
    query: resourceMembersQuery,
    variables: { resourceType, resourceId },
    data: {
      resourceMembers: {
        members: [...members.slice(0, index), ...members.slice(index + 1)],
        __typename,
      },
    },
  });

  return null;
};

export default {
  addMember,
  removeMember,
};
