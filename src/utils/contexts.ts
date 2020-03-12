import { createContext } from 'react';

export const DEFAULT_DOCUMENT_CONTEXT = {
  documentId: null,
  modalDiscussionId: null,
  firstMsgDiscussionId: null,
  deletedDiscussionId: null,
  inlineDiscussionTopic: null,

  setFirstMsgDiscussionId: () => {},
  setDeletedDiscussionId: () => {},
  resetInlineTopic: () => {},
  handleShowModal: () => {},
  handleCloseModal: () => {},
  afterUpdate: () => {},
  afterDelete: () => {},
  setForceUpdate: () => {},
};
export const DocumentContext = createContext(DEFAULT_DOCUMENT_CONTEXT);

export const DEFAULT_DISCUSSION_CONTEXT = {
  discussionId: null,
  context: null,
  draft: null,
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

// For the share modals
export const DEFAULT_RESOURCE_ACCESS_CONTEXT = {
  isModalOpen: false,
  setIsModalOpen: () => {},
};
export const ResourceAccessContext = createContext(
  DEFAULT_RESOURCE_ACCESS_CONTEXT
);
