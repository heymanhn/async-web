import resourcesQuery from 'graphql/queries/resources';
import { getLocalUser } from 'utils/auth';
import { RESOURCES_QUERY_SIZE } from 'utils/constants';
import { snakedQueryParams } from 'utils/queryParams';

const deleteUserResource = (_root, { resourceId }, { client }) => {
  const { userId } = getLocalUser();
  const data = client.readQuery({
    query: resourcesQuery,
    variables: {
      userId,
      queryParams: snakedQueryParams({ size: RESOURCES_QUERY_SIZE }),
    },
  });
  if (!data) return null;

  const { resources } = data;
  const { items, __typename } = resources;

  const index = (items || []).findIndex(item => {
    const { discussion, document } = item;
    const { id } = discussion || document;
    return id === resourceId;
  });
  if (index < 0) return null;

  client.writeQuery({
    query: resourcesQuery,
    variables: {
      userId,
      queryParams: snakedQueryParams({ size: RESOURCES_QUERY_SIZE }),
    },
    data: {
      resources: {
        ...resources,
        items: [...items.slice(0, index), ...items.slice(index + 1)],
        __typename,
      },
    },
  });

  return null;
};

export default {
  deleteUserResource,
};
