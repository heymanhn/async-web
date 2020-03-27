import { useContext } from 'react';

import workspaceQuery from 'graphql/queries/workspace';
import documentQuery from 'graphql/queries/document';
import discussionQuery from 'graphql/queries/discussion';
import {
  DiscussionContext,
  DocumentContext,
  WorkspaceContext,
} from 'utils/contexts';

const resourceProps = {
  workspace: {
    resourceQuery: workspaceQuery,
    createVariables: v => ({ workspaceId: v }),
    icon: 'layer-group',
  },
  document: {
    resourceQuery: documentQuery,
    createVariables: v => ({ documentId: v }),
    icon: 'file-alt',
  },
  discussion: {
    resourceQuery: discussionQuery,
    createVariables: v => ({ discussionId: v }),
    icon: 'comments-alt',
  },
};

const useDisambiguatedResource = () => {
  const { workspaceId } = useContext(WorkspaceContext);
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);

  let resourceType;
  if (workspaceId) {
    resourceType = 'workspace';
  } else if (documentId) {
    resourceType = 'document';
  } else {
    resourceType = 'discussion';
  }

  return {
    resourceType,
    resourceId: workspaceId || documentId || discussionId,
    ...resourceProps[resourceType],
  };
};

export default useDisambiguatedResource;
