/* eslint import/prefer-default-export: 0 */
import { createContext } from 'react';

export const DEFAULT_DOCUMENT_CONTEXT = {
  documentId: null,
  modalDiscussionId: null,
  inlineDiscussionTopic: null,

  resetInlineTopic: () => {},
  handleShowModal: () => {},
  handleCloseModal: () => {},
};
export const DocumentContext = createContext(DEFAULT_DOCUMENT_CONTEXT);

export const DEFAULT_DISCUSSION_CONTEXT = {
  discussionId: null,
  context: null,
  draft: null,

  setContext: () => {},
  afterCreate: () => {},
  afterCreateDraft: () => {},
  afterDelete: () => {},
};
export const DiscussionContext = createContext(DEFAULT_DISCUSSION_CONTEXT);

export const DEFAULT_MESSAGE_CONTEXT = {
  messageId: null,
  mode: null,
  threadPosition: null,

  setMode: () => {},
  afterCreate: () => {},
};
export const MessageContext = createContext(DEFAULT_MESSAGE_CONTEXT);
