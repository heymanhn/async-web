/* eslint import/prefer-default-export: 0 */
import { createContext } from 'react';

export const DocumentContext = createContext({
  documentId: null,
  modalDiscussionId: null,
  setModalDiscussionId: null,
});

export const DiscussionContext = createContext({
  discussionId: null,
  context: null,
  draft: null,
});

export const MessageContext = createContext({
  messageId: null,
  mode: null,
  setMode: null,
});
