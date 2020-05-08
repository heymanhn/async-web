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
  editor: null,

  handleShowThread: () => {},
  afterUpdateDocumentTitle: () => {},
  afterDeleteDocument: () => {},
  setForceUpdate: () => {},
  setViewMode: () => {},
};
export const DocumentContext = createContext(DEFAULT_DOCUMENT_CONTEXT);

export const DEFAULT_DISCUSSION_CONTEXT = {
  discussionId: null,
  readOnly: false,
  hideComposer: false,
  quoteReply: null,
  messageCount: null,
  bottomRef: {},
  composerRef: {},

  handleShowThread: () => {},
  afterCreateDiscussion: () => {},
  afterDeleteDiscussion: () => {},
  setForceUpdate: () => {},
  setHideComposer: () => {},
  setQuoteReply: () => {},
};
export const DiscussionContext = createContext(DEFAULT_DISCUSSION_CONTEXT);

export const DEFAULT_THREAD_CONTEXT = {
  threadId: null,
  initialTopic: null,
  topic: null,
  hideComposer: false,
  quoteReply: null,
  messageCount: null,
  modalRef: {},
  bottomRef: {},
  composerRef: {},

  afterDeleteThread: () => {},
  setHideComposer: () => {},
  setQuoteReply: () => {},
  handleClose: () => {},
};
export const ThreadContext = createContext(DEFAULT_THREAD_CONTEXT);

export const DEFAULT_MESSAGE_CONTEXT = {
  messageId: null,
  parentId: null,
  parentType: null,
  mode: null,
  draft: null,
  isModalOpen: false,
  listPosition: null,

  setMode: () => {},
  afterCreateMessage: () => {},
  afterUpdateMessage: () => {},
  handleCancel: () => {},
};
export const MessageContext = createContext(DEFAULT_MESSAGE_CONTEXT);
