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
  const isDocumentDiscussion = documentId && discussionId;

  let resourceId;
  let resourceType;
  let setForceUpdate;

  if (workspaceId) {
    resourceId = workspaceId;
    resourceType = 'workspace';
    setForceUpdate = setForceUpdateWorkspace;
  } else if (isDocumentDiscussion) {
    resourceId = discussionId;
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
