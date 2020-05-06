import { useContext } from 'react';

import {
  DiscussionContext,
  DocumentContext,
  ThreadContext,
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
  const { threadId } = useContext(ThreadContext);

  let resourceId;
  let resourceType;
  let setForceUpdate;

  if (workspaceId) {
    resourceId = workspaceId;
    resourceType = 'workspace';
    setForceUpdate = setForceUpdateWorkspace;
  } else if (threadId) {
    resourceId = threadId;
    resourceType = 'discussion';
    setForceUpdate = setForceUpdateDiscussion;
  } else if (documentId) {
    resourceId = documentId;
    resourceType = 'document';
    setForceUpdate = setForceUpdateDocument;
  } else {
    resourceId = discussionId;
    resourceType = 'discussion';
    setForceUpdate = setForceUpdateDiscussion;
  }

  return {
    ...buildResource(resourceType, resourceId),
    setForceUpdate,
  };
};

export default useDisambiguatedResource;
