/* eslint import/prefer-default-export: 0 */
import { createContext } from 'react';

export const DiscussionContext = createContext({
  documentId: null,
  discussionId: null,
  context: null,
});

export const MessageContext = createContext({
  messageId: null,
  mode: null,
  setMode: null,
});
