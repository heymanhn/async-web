import { useContext } from 'react';

import {
  DiscussionContext,
  DocumentContext,
  WorkspaceContext,
} from 'utils/contexts';
import buildResource from 'utils/resourceHelpers';

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

  const resourceId = workspaceId || documentId || discussionId;
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
    ...buildResource(resourceType, resourceId),
    setForceUpdate,
  };
};

export default useDisambiguatedResource;
