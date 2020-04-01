import workspaceQuery from 'graphql/queries/workspace';
import documentQuery from 'graphql/queries/document';
import discussionQuery from 'graphql/queries/discussion';

import { RESOURCE_ICONS } from 'utils/constants';

const buildResource = (resourceType, resourceId) => {
  const queryProps = {
    workspace: {
      resourceQuery: workspaceQuery,
      variables: { workspaceId: resourceId },
    },
    document: {
      resourceQuery: documentQuery,
      variables: { documentId: resourceId },
    },
    discussion: {
      resourceQuery: discussionQuery,
      variables: { discussionId: resourceId },
    },
  };

  return {
    resourceType,
    resourceId,
    ...queryProps[resourceType],
    icon: RESOURCE_ICONS[resourceType],
  };
};

export default buildResource;
