import { useContext } from 'react';

import workspaceQuery from 'graphql/queries/workspace';
import documentQuery from 'graphql/queries/document';
import discussionQuery from 'graphql/queries/discussion';
import {
  DiscussionContext,
  DocumentContext,
  WorkspaceContext,
} from 'utils/contexts';
import { RESOURCE_ICONS } from 'utils/constants';

const resourceProps = {
  workspace: {
    resourceQuery: workspaceQuery,
    createVariables: v => ({ workspaceId: v }),
    icon: RESOURCE_ICONS.workspace,
  },
  document: {
    resourceQuery: documentQuery,
    createVariables: v => ({ documentId: v }),
    icon: RESOURCE_ICONS.document,
  },
  discussion: {
    resourceQuery: discussionQuery,
    createVariables: v => ({ discussionId: v }),
    icon: RESOURCE_ICONS.discussion,
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
