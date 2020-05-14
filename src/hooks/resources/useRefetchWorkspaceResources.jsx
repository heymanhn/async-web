import { useQuery } from '@apollo/react-hooks';

import discussionQuery from 'graphql/queries/discussion';
import documentQuery from 'graphql/queries/document';
import workspaceResourcesQuery from 'graphql/queries/workspaceResources';

const useRefetchWorkspaceResources = ({ resourceType, resourceId }) => {
  const { refetch: getDiscussion } = useQuery(discussionQuery, {
    variables: { discussionId: resourceId },
    skip: true,
  });
  const { refetch: getDocument } = useQuery(documentQuery, {
    variables: { documentId: resourceId },
    skip: true,
  });

  const checkRefetchWorkspaceResources = async () => {
    const { data } = await (resourceType === 'discussion'
      ? getDiscussion()
      : getDocument());

    const { document, discussion } = data;
    const { workspaces } = document || discussion;

    if (!workspaces || !workspaces.length) return Promise.resolve([]);

    const [workspaceId] = workspaces;
    return Promise.resolve([
      {
        query: workspaceResourcesQuery,
        variables: { workspaceId, queryParams: { type: 'all' } },
      },
      {
        query: workspaceResourcesQuery,
        variables: { workspaceId, queryParams: { type: resourceType } },
      },
    ]);
  };

  return checkRefetchWorkspaceResources;
};

export default useRefetchWorkspaceResources;
