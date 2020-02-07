/* eslint import/prefer-default-export: 0 */
import { createContext } from 'react';

export const DocumentContext = createContext({
  documentId: null,
  modalDiscussionId: null,
  handleShowModal: () => {},
  handleCloseModal: () => {},
});

export const DiscussionContext = createContext({
  discussionId: null,
  context: null,
  draft: null,

  afterCreate: () => {},
  afterCreateDraft: () => {},
});

export const MessageContext = createContext({
  messageId: null,
  mode: null,
  setMode: () => {},

  afterCreate: () => {},
});
