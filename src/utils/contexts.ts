import { createContext } from 'react';

export const DEFAULT_APP_CONTEXT = {
  pusher: null,
};
export const AppContext = createContext(DEFAULT_APP_CONTEXT);

export const DEFAULT_NAVIGATION_CONTEXT = {
  resource: null,
  selectedResourceId: null, // used by the sidebar
  isResourceAccessModalOpen: false,
  isInviteModalOpen: false,
  resourceCreationModalMode: null,

  setSelectedResourceId: () => {},
  setIsResourceAccessModalOpen: () => {},
  setIsInviteModalOpen: () => {},
  setResourceCreationModalMode: () => {},
};
export const NavigationContext = createContext(DEFAULT_NAVIGATION_CONTEXT);

export const DEFAULT_WORKSPACE_CONTEXT = {
  workspaceId: null,
  viewMode: null,

  setViewMode: () => {},
  setForceUpdate: () => {},
};
export const WorkspaceContext = createContext(DEFAULT_WORKSPACE_CONTEXT);

export const DEFAULT_DOCUMENT_CONTEXT = {
  documentId: null,
  channelId: null,
  readOnly: false,
  viewMode: null,

  handleShowThread: () => {},
  afterUpdateDocument: () => {},
  afterUpdateDocumentTitle: () => {},
  afterDeleteDocument: () => {},
  setForceUpdate: () => {},
  setViewMode: () => {},
};
export const DocumentContext = createContext(DEFAULT_DOCUMENT_CONTEXT);

export const DEFAULT_DISCUSSION_CONTEXT = {
  discussionId: null,
  readOnly: false,

  handleShowThread: () => {},
  afterCreateDiscussion: () => {},
  afterDeleteDiscussion: () => {},
  setForceUpdate: () => {},
};
export const DiscussionContext = createContext(DEFAULT_DISCUSSION_CONTEXT);

export const DEFAULT_THREAD_CONTEXT = {
  threadId: null,
  initialTopic: null,
  topic: null,
  modalRef: {},

  afterDeleteThread: () => {},
};
export const ThreadContext = createContext(DEFAULT_THREAD_CONTEXT);

export const DEFAULT_MESSAGE_CONTEXT = {
  messageId: null,
  parentId: null,
  mode: null,
  draft: null,
  threadPosition: null,

  setMode: () => {},
  afterCreateMessage: () => {},
  handleCancel: () => {},
};
export const MessageContext = createContext(DEFAULT_MESSAGE_CONTEXT);

// Used for calculating coordinates relative to the current text selection
// in Editor content.
export const DEFAULT_SELECTION_CONTEXT = {
  containerRef: {},
  scrollRef: {},
};
export const SelectionContext = createContext(DEFAULT_SELECTION_CONTEXT);
