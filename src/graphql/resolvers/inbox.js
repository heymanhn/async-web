import inboxQuery from 'graphql/queries/inbox';
import { getLocalUser } from 'utils/auth';

/*
 * Remove the entry from two of the tabs. The "All" tab, and either the
 * "Documents" or "Discussions" tab.
 */
const deleteFromInboxQuery = (type, { resourceType, resourceId }, client) => {
  const { userId } = getLocalUser();
  const {
    inbox: { items, pageToken, __typename },
  } = client.readQuery({
    query: inboxQuery,
    variables: { userId, queryParams: { type } },
  });

  const index = items.findIndex(item => {
    const resource = item[resourceType];
    return resource && resource.id === resourceId;
  });

  client.writeQuery({
    query: inboxQuery,
    variables: { userId, queryParams: { type } },
    data: {
      inbox: {
        items: [...items.slice(0, index), ...items.slice(index + 1)],
        pageToken,
        __typename,
      },
    },
  });
};

const deleteResourceFromInbox = (_root, props, { client }) => {
  const { resourceType } = props;
  ['all', resourceType].forEach(type =>
    deleteFromInboxQuery(type, props, client)
  );

  return null;
};

export default {
  deleteResourceFromInbox,
};
