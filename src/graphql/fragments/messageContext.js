import gql from 'graphql-tag';

import conversationMessage from './conversationMessage';

export default gql`
  fragment MessageContext on Conversation {
    messageCount
    lastMessage @type(name: "Message") {
      ...ConversationMessage
    }
  }
  ${conversationMessage}
`;
