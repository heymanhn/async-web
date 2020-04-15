const addToWorkspace = (_root, { resource, workspaceId }, { client }) => {
  const { resourceType, resourceQuery, variables } = resource;
  const data = client.readQuery({
    query: resourceQuery,
    variables,
  });
  if (!data) return null;

  const newResource = { ...data[resourceType], workspaces: [workspaceId] };
  const newData = {};
  newData[resourceType] = newResource;

  client.writeQuery({
    query: resourceQuery,
    variables,
    data: newData,
  });

  return null;
};

const removeFromWorkspace = (_root, { resource }, { client }) => {
  const { resourceType, resourceQuery, variables } = resource;
  const data = client.readQuery({
    query: resourceQuery,
    variables,
  });
  if (!data) return null;

  const newResource = { ...data[resourceType], workspaces: null };
  const newData = {};
  newData[resourceType] = newResource;

  client.writeQuery({
    query: resourceQuery,
    variables,
    data: newData,
  });

  return null;
};

export default {
  addToWorkspace,
  removeFromWorkspace,
};
