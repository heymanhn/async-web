import { createContext } from 'react';

export const DEFAULT_APP_CONTEXT = {
  pusher: null,
};
export const AppContext = createContext(DEFAULT_APP_CONTEXT);

export const DEFAULT_WORKSPACE_CONTEXT = {
  workspaceId: null,
  viewMode: null,

  setViewMode: () => {},
  setForceUpdate: () => {},
};
export const WorkspaceContext = createContext(DEFAULT_WORKSPACE_CONTEXT);

export const DEFAULT_DOCUMENT_CONTEXT = {
  documentId: null,
  isModalOpen: false,
  readOnly: false,
  modalDiscussionId: null,
  firstMsgDiscussionId: null,
  deletedDiscussionId: null,
  inlineDiscussionTopic: null,
  viewMode: null,
  channelId: null,

  setFirstMsgDiscussionId: () => {},
  setDeletedDiscussionId: () => {},
  resetInlineTopic: () => {},
  handleShowModal: () => {},
  handleCloseModal: () => {},
  afterUpdate: () => {},
  afterUpdateTitle: () => {},
  afterDelete: () => {},
  setForceUpdate: () => {},
  setViewMode: () => {},
};
export const DocumentContext = createContext(DEFAULT_DOCUMENT_CONTEXT);

export const DEFAULT_DISCUSSION_CONTEXT = {
  discussionId: null,
  context: null,
  draft: null,
  readOnly: false,
  modalRef: {},
  isModal: false,

  setContext: () => {},
  afterCreate: () => {},
  afterCreateDraft: () => {},
  afterDelete: () => {},
  setForceUpdate: () => {},
};
export const DiscussionContext = createContext(DEFAULT_DISCUSSION_CONTEXT);

export const DEFAULT_MESSAGE_CONTEXT = {
  messageId: null,
  mode: null,
  threadPosition: null,

  setMode: () => {},
  afterCreate: () => {},
  handleCancel: () => {},
};
export const MessageContext = createContext(DEFAULT_MESSAGE_CONTEXT);

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
