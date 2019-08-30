import gql from 'graphql-tag';

import conversationMessage from './conversationMessage';

export default gql`
  fragment ConversationMessageItems on MessagesResponse {
    items @type(name: "[ConversationMessageItem]") {
      message @type(name: "Message") {
        ...ConversationMessageObject
      }
    }
    messageCount
    pageToken
  }
  ${conversationMessage}
`;
