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
  const { workspaceId, setForceUpdate: setForceUpdateWorkspace } = useContext(
    WorkspaceContext
  );
  const { documentId, setForceUpdate: setForceUpdateDocument } = useContext(
    DocumentContext
  );
  const { discussionId, setForceUpdate: setForceUpdateDiscussion } = useContext(
    DiscussionContext
  );

  let resourceType;
  let setForceUpdate;

  if (workspaceId) {
    resourceType = 'workspace';
    setForceUpdate = setForceUpdateWorkspace;
  } else if (documentId) {
    resourceType = 'document';
    setForceUpdate = setForceUpdateDocument;
  } else {
    resourceType = 'discussion';
    setForceUpdate = setForceUpdateDiscussion;
  }

  return {
    resourceType,
    resourceId: workspaceId || documentId || discussionId,
    setForceUpdate,
    ...resourceProps[resourceType],
  };
};

export default useDisambiguatedResource;
